
interface HttpClientInterface {

}

export interface HttpClientCallback extends HttpClientInterface {
    onSuccess: (result) => void;
    onError: (err) => void;
    onProgress?: (percentage) => void;
}

export interface HttpClientListOptions extends HttpClientInterface {
    prefix?: string;
    marker?: string;
    delimiter?: string;
}

export enum HttpClientBuckets {
    PRIVATE_BUCKET = "siiva-video",
    PUBLIC_BUCKET = "siiva-video-public"
}
