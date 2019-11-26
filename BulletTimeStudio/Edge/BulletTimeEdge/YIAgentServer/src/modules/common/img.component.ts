import * as fs from 'fs';

export class ImgUtil {
    static base64_encode(file) {
        var bitmap = fs.readFileSync(file);
        return new Buffer(bitmap).toString('base64');
    }
}
