import { makeAutoObservable } from 'mobx';

class MenuStateStore {
  bruh: boolean = true

  constructor() {
    makeAutoObservable(this);
  }
}

const menuState = new MenuStateStore();
export default menuState;
