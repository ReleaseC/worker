import { Component } from "@nestjs/common";
import { RetObject } from "../common/ret.component";
import axios from "../../node_modules/axios";

@Component()
export class WeiboService {

  async getWeibo(query) {
    let ret = new RetObject();

    try {
      if (!query.code) {
        throw new Error("code 无效");
      }

      // 获取 access token
      let retContainsAccessToken = await axios.post("https://api.weibo.com/oauth2/access_token?client_id=2812607071&client_secret=1e49605e4675d26a3a97e2ff4a8f24e7&grant_type=authorization_code&redirect_uri=https://bt.siiva.com/weibo/get_weibo&code=" + query.code);

      if ( !retContainsAccessToken || !retContainsAccessToken.data ) { throw new Error("获取access token 无效"); }

      console.log(retContainsAccessToken);
      ret.code = 0;
      ret.result = retContainsAccessToken.data;
      console.log(ret);
    } catch (e) {
      ret.code = 2;
      ret.description = e;
    }

    return ret;
  }
}