import { APIGatewayEvent, Context as LambdaContext } from 'aws-lambda';
import createRequest from 'serverless-http/lib/provider/aws/create-request';
import { IAppResponse } from 'bind-rest';
import { IBindRestApp } from './interfaces/IBindRestApp';
import { IBindRequestFactory } from './interfaces/IBindRequestContext';
// import {IAppResponse} from "bind-rest";
// import { AWS_API_GATEWAY_EVENT, AWS_LAMBDA_CONTEXT } from './consts';

export * from './consts';

const debug = require('debug')('bind:rest:aws:lambda');

let app: IBindRestApp;

debug('Required bind-rest-aws-lambda index');

const createHandlerAsync = (
  bindRestApplication: IBindRestApp,
  bindContextFactory: IBindRequestFactory,
): Function => async (event: APIGatewayEvent, context: LambdaContext): Promise<IAppResponse> => {
  debug('Using createHandlerAsync');
  if (!app) {
    debug('app NOT_INITIALIZED event=%j context=%j', event, context);
    await Reflect.apply(Reflect.get(bindRestApplication, 'init'), bindRestApplication, []);
    app = bindRestApplication;
    return app.getAppResponse(bindContextFactory.create(createRequest(event, context, {})));
  }
  debug('app IS_INITIALIZED. event=%j context=%j', event, context);
  return app.getAppResponse(bindContextFactory.create(createRequest(event, context, {})));
};

const createHandlerPromise = (
  bindRestApplication: IBindRestApp,
  bindContextFactory: IBindRequestFactory,
): Function => (event: APIGatewayEvent, context: LambdaContext): Promise<any> => {
  debug('Using createHandlerPromise');
  if (!app) {
    debug('app NOT_INITIALIZED event=%j context=%j', event, context);
    return bindRestApplication
      .init()
      .then(() => {
        app = bindRestApplication;
      })
      .then(() => {
        return app.getAppResponse(bindContextFactory.create(createRequest(event, context, {})));
      });
  }
  debug('app IS_INITIALIZED event=%o context=%o', event, context);
  return app.getAppResponse(bindContextFactory.create(createRequest(event, context, {})));
};

const createHandlerPromiseNoWait = (
  bindRestApplication: IBindRestApp,
  bindContextFactory: IBindRequestFactory,
): Function => (event: APIGatewayEvent, context: LambdaContext): Promise<any> => {
  context.callbackWaitsForEmptyEventLoop = false;
  debug('Using createHandlerPromiseNoWait');
  if (!app) {
    debug('app NOT_INITIALIZED event=%o context=%o', event, context);
    return bindRestApplication
      .init()
      .then(() => {
        app = bindRestApplication;
      })
      .then(() => {
        return app.getAppResponse(bindContextFactory.create(createRequest(event, context, {})));
      });
  }
  debug('app IS_INITIALIZED');
  return app.getAppResponse(bindContextFactory.create(createRequest(event, context, {})));
};

export { createHandlerAsync, createHandlerPromise, createHandlerPromiseNoWait };
