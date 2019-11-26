import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.prod";
import {ApiManagerCallback} from "./ApiManagerCallback";

/**
 * 统管所有的REST API
 */
class ApiManager {
  private constructor(private http: HttpClient) {}
  private static INSTANCE: ApiManager = null;

  public static getInstance(http: HttpClient): ApiManager {
    return ApiManager.INSTANCE || (ApiManager.INSTANCE = new ApiManager(http))
  }

  /**
   * 获取分组列表
   * @type {string}
   */
  private static API_GET_GROUPS: string =
    `${environment.apiServer}account/v2/get_groups?account=${localStorage.getItem('account') || ''}&access_token=${localStorage.getItem('token') || ''}`;


  public getGroups(callback: ApiManagerCallback) {
    this.http.get(ApiManager.API_GET_GROUPS).subscribe(callback.next);
  }

}

export default ApiManager;
