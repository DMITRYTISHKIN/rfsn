import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {
  private readonly DEPARTMENTS_PANEL_CLOSE = 'departments:panel:close';

  constructor() { }

  public remove(name) {
    localStorage.removeItem(name);
  }

  public save(name, data) {
    localStorage.removeItem(name);
    localStorage.setItem(name, JSON.stringify(data));
  }

  public get(name: string) {
    return this.tryGetFromlocalStorage(name);
  }

  public removeSession(name) {
    sessionStorage.removeItem(name);
  }

  public saveSession(name, data) {
    sessionStorage.removeItem(name);
    sessionStorage.setItem(name, JSON.stringify(data));
  }

  public getSession(name: string) {
    return this.tryGetFromSessionStorage(name);
  }

  public hasSession(name: string): boolean {
    return Boolean(sessionStorage.getItem(name));
  }

  public setDepartmentsPanelClose(isClose: boolean): void {
    this.save(this.DEPARTMENTS_PANEL_CLOSE, isClose);
  }

  public getDepartmentsPanelClose(): boolean {
    return Boolean(this.get(this.DEPARTMENTS_PANEL_CLOSE));
  }

  public resetDepartmentsPanelClose(): void {
    this.remove(this.DEPARTMENTS_PANEL_CLOSE);
  }

  private tryGetFromlocalStorage = (propertyName: string): any => {
    return propertyName ? this.tryGetFromJSON(localStorage.getItem(propertyName)) : null;
  }

  private tryGetFromSessionStorage = (propertyName: string): any => {
    return propertyName ? this.tryGetFromJSON(sessionStorage.getItem(propertyName)) : null;
  }

  private tryGetFromJSON = (json: string): any => {
    if (json === 'undefined') {
      return;
    }
    return json ? JSON.parse(json) : null;
  }
}
