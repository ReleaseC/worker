export class StatusService {

    private statusCollection: any;
    private updateTime: string;
    private photoTime: string;
    constructor() {
        this.statusCollection = [];
        this.updateTime = new Date().toLocaleString();
    }

    getData() {
        return { data: this.statusCollection, updateTime: this.updateTime, photoTime: this.photoTime};
    }

    updateData(data: any) {
        this.statusCollection = data;
        this.updateTime = new Date().toLocaleString();
    }

    updatePhotoTime() {
        this.photoTime = new Date().toLocaleString();
    }
}