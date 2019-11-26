import { Component, OnInit,ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { UploadImageService } from '../share/upload-image.service';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-uploadphoto',
  templateUrl: './uploadphoto.component.html',
  styleUrls: ['./uploadphoto.component.css']
})
@Injectable()
export class UploadPhotoComponent implements OnInit {
  imageUrl: string = "";
  fileToUpload: File = null;
  base64textString:any;
  small_img:any;
  isshow_search:boolean=false;
  isshow_facedemo:boolean=true;
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router, private http: HttpClient,private imageService : UploadImageService,public element:ElementRef
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
  });

  }
handleFileInput(file: FileList) {
    // console.log(file)
    this.fileToUpload = file.item(0);
    console.log(this.fileToUpload)

    //Show image preview
    var reader = new FileReader();
    var self=this;
   reader.onload = async (event:any) => {
      // self.imageUrl = event.target.result;
      // console.log(self.imageUrl)
      self.getBase64(event.target.result,(data:string)=>{
        self.imageUrl = event.target.result;
        self.isshow_facedemo=false;
        self.isshow_search=true;
        self.small_img=data
        // console.log(self.small_img)
      })
    }
    reader.readAsDataURL(this.fileToUpload);
  }

  OnSubmit(e:object){
    this.click(e)
    this.imageService.postFile(this.fileToUpload).subscribe(
      data =>{
        console.log(data)
        // console.log('done');
        // Image.value = null;
        // this.imageUrl = "assets/images/face_demo.png";
      }
    );
   }

   getBase64(url,callback){
      var img=new Image()
      img.src=url;
      var data='';
      var self=this
      img.onload=function(){
        var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');
        if(img.width>=img.height){
          self.element.nativeElement.querySelector(".face_real").style.width='90%';
          self.element.nativeElement.querySelector(".face_real").style.height='auto';
          self.element.nativeElement.querySelector(".face_real").style.left='5%';
          self.element.nativeElement.querySelector(".face_real").style.top='50%';
          self.element.nativeElement.querySelector(".face_real").style.transform='translateY(-50%)';
        }else{
          self.element.nativeElement.querySelector(".face_real").style.height='100%';
          self.element.nativeElement.querySelector(".face_real").style.width='auto';
          self.element.nativeElement.querySelector(".face_real").style.top='0%';
          self.element.nativeElement.querySelector(".face_real").style.left='50%';
          self.element.nativeElement.querySelector(".face_real").style.transform='translateX(-50%)';
        }
        canvas.width = img.width/2
        canvas.height = img.height/2
        // console.log(img.width+'+'+img.height)
        // console.log(canvas.width+'+'+canvas.height)    
      //利用canvas进行绘图
      ctx.drawImage(img, 0, 0, img.width, img.height,0,0, canvas.width,canvas.height);   
      //将原来图片的质量压缩到原先的0.8倍。
      data = canvas.toDataURL('image/jpeg', 0.8) //data url的形式
      callback?callback(data):null
      }
   }

   cancel(event){
    this.click(event);
     this.imageUrl='';
     this.isshow_search=false;
     this.isshow_facedemo=true;
   }

   click(e){
     e.style.opacity=0.5;
     setTimeout(()=>{
       e.style.opacity=1;
     },100)
   }

}