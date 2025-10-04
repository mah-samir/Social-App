import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService)


  
  if (localStorage.getItem('token')) {
    req = req.clone({
      setHeaders: {
        token: localStorage.getItem('token')!
      }
    })
  }

  return next(req);
};
