
import { environment } from '../../environments/environment';
export class LoggerService {
    log(text: any){
        if (!environment.production) {
          console.log(text)
        }
   }
}