import { Component, OnInit ,Input,OnChanges} from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
    selector: 'app-installation',
    templateUrl: './installation.component.html',
    styleUrls: ['./installation.component.css']
})
export class InstallationComponent implements OnInit,OnChanges {
    // @Input() data:string;
    siteId:any;
    select:any;
    siteid_id:any;
    group:any;

    constructor(private activatedRoute: ActivatedRoute, 
        private http: HttpClient ) { }

    ngOnInit() {
        this.siteid_id = localStorage.getItem('select_siteId');
        console.log(this.siteid_id)
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            // this.select = params['id'];
            // console.log(this.select)
        }) 
        
    }
    ngOnChanges(){
    //     console.log(this.data+"....ngonchanges")
    //    this.getsiteId()
    }
    // getsiteId(){
    //     // console.log(this.select)
    // }
}
