/**
 * @fileoverview gRPC-Web generated client stub for ws.siiva.device
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.ws = {};
proto.ws.siiva = {};
proto.ws.siiva.device = require('./device_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.ws.siiva.device.statusClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

  /**
   * @private @const {?Object} The credentials to be used to connect
   *    to the server
   */
  this.credentials_ = credentials;

  /**
   * @private @const {?Object} Options for the client
   */
  this.options_ = options;
};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.ws.siiva.device.statusPromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!proto.ws.siiva.device.statusClient} The delegate callback based client
   */
  this.delegateClient_ = new proto.ws.siiva.device.statusClient(
      hostname, credentials, options);

};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.ws.siiva.device.GetDeviceStatusRequest,
 *   !proto.ws.siiva.device.GetDeviceStatusReply>}
 */
const methodInfo_status_GetDeviceStatus = new grpc.web.AbstractClientBase.MethodInfo(
  proto.ws.siiva.device.GetDeviceStatusReply,
  /** @param {!proto.ws.siiva.device.GetDeviceStatusRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.ws.siiva.device.GetDeviceStatusReply.deserializeBinary
);


/**
 * @param {!proto.ws.siiva.device.GetDeviceStatusRequest} request The
 *     request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.ws.siiva.device.GetDeviceStatusReply)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.ws.siiva.device.GetDeviceStatusReply>|undefined}
 *     The XHR Node Readable Stream
 */
proto.ws.siiva.device.statusClient.prototype.getDeviceStatus =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/ws.siiva.device.status/GetDeviceStatus',
      request,
      metadata,
      methodInfo_status_GetDeviceStatus,
      callback);
};


/**
 * @param {!proto.ws.siiva.device.GetDeviceStatusRequest} request The
 *     request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.ws.siiva.device.GetDeviceStatusReply>}
 *     The XHR Node Readable Stream
 */
proto.ws.siiva.device.statusPromiseClient.prototype.getDeviceStatus =
    function(request, metadata) {
  return new Promise((resolve, reject) => {
    this.delegateClient_.getDeviceStatus(
      request, metadata, (error, response) => {
        error ? reject(error) : resolve(response);
      });
  });
};


module.exports = proto.ws.siiva.device;

