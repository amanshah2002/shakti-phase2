import { catchError } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Router } from '@angular/router';

import { LoadingService, LoadingOverlayRef } from './loading.service';
import { Observable, throwError } from 'rxjs';
import { tap } from "rxjs/internal/operators";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let loadingRef: LoadingOverlayRef;

    // This is a little hacky and related to change detection (ExpressionChangedAfterItHasBeenCheckedError).
    // More informations here:
    // https://blog.angularindepth.com/everything-you-need-to-know-about-the-expressionchangedafterithasbeencheckederror-error-e3fd9ce7dbb4

    Promise.resolve(null).then(() => loadingRef = this.loadingService.open());

    return next.handle(req).pipe(tap(event => {
      if (event instanceof HttpResponse && loadingRef) {
        loadingRef.close();
      }
    }),catchError(error => {
      if (loadingRef) {
        loadingRef.close();
      }

      return throwError(error);
    }));
  }
}
