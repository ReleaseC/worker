/**
 * ApiManagerCallback for ApiManager subscribe
 */
export interface ApiManagerCallback {
  /**
   * onSuccessCallback
   * @param value data
   */
  next: (value: any) => void;
  error?: (error: any) => void;
  complete?: () => void;
}
