import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UploadImageService {

  constructor(private http : HttpClient) { }

  // postFile(dataUrl: string) {
  //   const endpoint = 'http://iva.siiva.com/face/check';
  //   const formData: FormData = new FormData();
  //   formData.append('img', dataUrl);
  //   console.log(formData)
  //   return this.http
  //     .post(endpoint, formData);
  // }

  postFile(fileToUpload: File,activity_id) {
    const endpoint = 'https://iva.siiva.com/admin/file/upload';
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    formData.append('activity_id', activity_id);
    console.log(formData)
    return this.http
      .post(endpoint, formData);
  }

}
