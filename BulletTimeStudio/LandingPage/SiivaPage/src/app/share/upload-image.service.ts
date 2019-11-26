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

  postFile(fileToUpload: File) {
    const endpoint = 'http://api.siiva.com/face/check';
    const formData: FormData = new FormData();
    formData.append('img', fileToUpload, fileToUpload.name);
    console.log(formData)
    return this.http
      .post(endpoint, formData);
  }

}
