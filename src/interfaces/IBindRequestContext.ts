import * as http from 'http';

export interface IBindRequestFactory {
  create: (req: http.IncomingMessage) => any;
}
