export class AuthService {
    public isConfirm: Boolean = false;
    public returnURL: String = '';
    public params: any = '';

    public formatDate(time) {
        // 格式化日期，获取今天的日期
        const Dates = new Date( time );
        const year: number = Dates.getFullYear();
        const month: any = ( Dates.getMonth() + 1 ) < 10 ? '0' + ( Dates.getMonth() + 1 ) : ( Dates.getMonth() + 1 );
        const day: any = Dates.getDate() < 10 ? '0' + Dates.getDate() : Dates.getDate();
        return year + '-' + month + '-' + day;
    }
}
