export interface IBindRestApp {
  init: () => Promise<boolean>;
  getAppResponse: (context: any) => Promise<any>;
}
