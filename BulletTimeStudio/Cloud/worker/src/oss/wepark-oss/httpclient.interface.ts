
interface HttpClientInterface {

}

export interface weparkHttpClientCallback extends HttpClientInterface {
    onSuccess: (result) => void;
    onError: (err) => void;
    onProgress?: (percentage) => void;
}

export enum weparkHttpClientBuckets {
    PRIVATE_BUCKET = "",
    PUBLIC_BUCKET = "wepark-video"
}
