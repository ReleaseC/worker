export enum RET_STATUS {
    SUCCESS = 1,
    FAIL = 0
}

export class RetObject {
    code: number;
    status :number;
    statusMsg : string;
    description: string;
    result: Object;
}
