
import { Injectable } from '@angular/core';
import { UserModel } from '../model/User.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  storeInLocal(user: UserModel) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  storeInSession(user: UserModel) {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  removeUser = () => {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (user) {
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
    }
  }
  setItem = (name, item, store: string) => {
    if (store == 'local') {
      localStorage.setItem(name, JSON.stringify(item));
    } else {
      sessionStorage.setItem(name, JSON.stringify(item));
    }

  }
  getItem = (name, store: string) => {
    if (store == 'local') {
      return JSON.parse(localStorage.getItem(name));
    } else {
      return JSON.parse(sessionStorage.getItem(name));
    }

  }
}
