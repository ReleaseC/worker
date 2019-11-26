
interface HttpClientInterface {

}

export interface HttpClientCallback extends HttpClientInterface {
    onSuccess: (result) => void;
    onError: (err) => void;
    onProgress?: (percentage) => void;
}

export enum HttpClientBuckets {
    PRIVATE_BUCKET = "siiva-video",
    PUBLIC_BUCKET = "siiva-video-public"
}
