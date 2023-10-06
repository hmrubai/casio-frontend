import { Injectable, ErrorHandler } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Cookie } from 'ng2-cookies';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    isAuthincate: boolean = false;
    public currentUserDetails: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    constructor(
        private http: HttpClient,
        private toastr: ToastrService,
        private router: Router
    ) {
        // this.currentUserDetails = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
        if (Cookie.check('.CASIO.Cookie'))
            this.currentUserDetails = new BehaviorSubject<any>(JSON.parse(Cookie.get('.CASIO.Cookie')));
    }

    public get currentUserValue(): any {
        return Cookie.check('.CASIO.Cookie') ? this.currentUserDetails.value : null;
    }

    public isAuthenticated(): boolean {
        return Cookie.check('.CASIO.Cookie');
    }

    login(params: any) {
        const obj = {
            email: params.username,
            password: params.password
        };

        return this.http.post<any>(environment.baseUrl + 'auth/login', obj).pipe(map(data => {
            if(data.status){
                let response = data.data;
                
                const user = {
                    id: response.id,
                    email: response.email,
                    contact_no: response.contact_no,
                    institution: response.institution,
                    education: response.education,
                    full_name: response.name,
                    address: response.address,
                    user_type: response.user_type,
                    access_token: response.token,
                    image: response.image,
                    created: response.updated_at,
                }
                let expireDate = new Date('2030-07-19');
                Cookie.set('.CASIO.Cookie', JSON.stringify(user), expireDate, '/', window.location.hostname, false);
                this.currentUserDetails.next(user);
                const res = {
                    data: user,
                    errors: null,
                    message: "",
                    status: true
                };
                return res;
            }else{
                const res = {
                    data: [],
                    errors: null,
                    message: data.message,
                    status: false
                };
                return res;
            }
        }),
        catchError(err => {
            return of(err);
        }));
    }

    clientLogout(hostname: any) {
        this.isAuthincate = false;
        Cookie.delete('.CASIO.Cookie', '/', hostname);
        this.toastr.warning('Logout Successful!', 'Attention!', { timeOut: 2000 });
        this.currentUserDetails.next(null);
        
        this.router.navigate(['/login']).then(() => {
            window.location.reload();
        });
    }

    logout(hostname: any) {
        return this.http.post<any>(environment.baseUrl + 'logout', {}).pipe(
            map(res => {
                if (res.success) {
                    this.isAuthincate = false;
                    Cookie.delete('.CASIO.Cookie', '/', hostname);
                    this.toastr.success(res.message, 'Success!', { timeOut: 2000 });
                    this.currentUserDetails.next(null);
                    this.router.navigate(['/login']);
                }
                return res;
            })
        );

    }

    registerSystemAdmin(url: any, params: any) {
        return this.http.post<any>(environment.apiUrl + url, params).pipe(
            map(res => {
                return res;
            })
        );
    }

}
