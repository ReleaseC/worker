export enum CODE_VALUE {
    SUCCESS = 1,
    FAIL = 0
}

export class RetObject {
    code: CODE_VALUE;
    description: string;
    result: Object;
}