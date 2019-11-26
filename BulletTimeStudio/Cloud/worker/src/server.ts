import { NestFactory } from "@nestjs/core";
import { ApplicationModule } from "./app.module";
import * as express from "express";
import * as io from "socket.io-client";
import { isWorker, worker } from "cluster";
import { WorkerUtil } from "./common/worker.util";
import { WorkerCallback } from "./worker/worker.callback";
import { EngineFactory } from "./worker/engine.factory";
import {
  SOCKET_EVENT,
  WORKER_KEY,
  IWorkerCallback,
  IEngineFactory,
  IEngine,
  TASK_KEY
} from "./common/worker.interface";
const util = require("util");
const request = require("request");
const config = require(`../config/${process.env.NODE_ENV ||
  "production"}.json`);
import * as program from "commander";

const winston = require("winston");
const config_winston = winston.config;
require("winston-logio-2");
const path = require("path");

const logFormat = {
  timestamp: function() {
    return `${new Date().toLocaleString()}`;
  },
  formatter: function(options) {
    return (
      options.timestamp() +
      " " +
      config_winston.colorize(options.level, options.level.toUpperCase()) +
      " " +
      (options.message ? options.message : "") +
      " " +
      (options.meta && Object.keys(options.meta).length
        ? JSON.stringify(options.meta)
        : "")
    );
  }
};

// const fileFormat = {
//   filename: `/var/log/worker.log`,
//   timestamp: function() {
//     return `${new Date().toLocaleString()}`;
//   }
// };

const logio_setting = {
  port: 28777,
  node_name: "worker",
  host: "106.75.224.77"
};

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console(logFormat),
    // new winston.transports.File(fileFormat)
    // new (winston.transports.Logio)(logio_setting),
  ]
});

function setupSocket(workerUtil: WorkerUtil) {
  console.log("config.apiServer=" + config.apiServer);
  let socket = io.connect(
    config.apiServer,
    { reconnect: true }
  );

  let cb = new WorkerCallback(socket);
  const engineFactory = new EngineFactory();

  //receive connect
  socket.on(SOCKET_EVENT.CONNECT, function(data) {
    console.log("Connected!");
    //emit register
    let oRegister = {
      worker_id: WorkerUtil.getWorkerId(),
      machine_info: WorkerUtil.getWorkerInfo()
    };
    console.log("oRegister=" + JSON.stringify(oRegister));
    socket.emit(SOCKET_EVENT.REGISTER, oRegister);
  });

  // emit is_alive
  var setTimeoutPromise = util.promisify(setInterval);
  setTimeoutPromise(function() {
    let oIsAlive = {};
    oIsAlive[WORKER_KEY.STATUS] = "1";
    oIsAlive[WORKER_KEY.ID] = WorkerUtil.getWorkerId();
    socket.emit(SOCKET_EVENT.IS_ALIVE, oIsAlive);
    // check task
    if (!cb.flag) {
      cb.setFlag(2);
      allocatingTask(cb, engineFactory);
    }
  }, 5000);
}

async function bootstrap(workerUtil: WorkerUtil) {
  const server = express();
  const app = await NestFactory.create(ApplicationModule, server);
  server.use("/assets", express.static("./assets"));
  server.use("/apidoc", express.static("./apidoc"));
  // server.use("/",express.static("../../output"))   //advertise页面
  await app.listen(WorkerUtil.getPort());
  setInterval(() => {
    logger.info("worker alive!", { workerId: WorkerUtil.getWorkerId() });
  }, 180000);
}

async function allocatingTask(
  cb: IWorkerCallback,
  engineFactory: IEngineFactory
) {
  request(
    {
      url: `${config.apiServer}/task/task_get?${
        WORKER_KEY.ID
      }=${WorkerUtil.getWorkerId()}`,
      method: "GET",
      json: true
    },
    (error, response, body) => {
      if (!error && response.statusCode == 200 && body.task !== null) {
        console.log("领到任务啦》》》》》》》》》》》》》》》》》》》");
        cb.changeFlag();
        const workerEngine: IEngine = engineFactory.createFactory(
          body.task.task.type
        );
        workerEngine !== undefined
          ? workerEngine.cut_video(body.task, cb, logger)
          : cb.onAbort(body.task, "unsupported type");
      } else {
        cb.setFlag(0);
      }
    }
  );
}

let workerUtil = new WorkerUtil();

const MODE_STANDALONE = "standalone";
program
  .version("0.1.0")
  .option("-m, --mode [mode]", "Execution mode, for unit test. If self test, set mode to standalone")
  .option("-t, --task [task]", "task file, e.g. momemt/task1.json")
  .parse(process.argv);

  // node index.js -t moment/task7.json -m standalone本地段执行指令
if (program.mode != undefined && program.mode == MODE_STANDALONE) {
    console.log('Standalone mode: ' + program.task);

    let task = require(`${path.resolve(__dirname, '.', '..')}/testdata/${program.task}`);

    const engineFactory = new EngineFactory();
    let cb = new WorkerCallback('socket');
    const workerEngine: IEngine = engineFactory.createFactory(task.task.type);
    if (workerEngine !== undefined) {
        workerEngine.cut_video(task, cb, logger);
        console.log('Task complete! ' + program.task);
    }
    else {
        console.log('No associated engine: ' + task.type);
    }
} else {
  setupSocket(workerUtil);
  bootstrap(workerUtil);
}
