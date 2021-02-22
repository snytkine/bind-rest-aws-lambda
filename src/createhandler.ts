import {
  APIGatewayEvent,
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
  Context as LambdaContext,
} from 'aws-lambda';
import { Application, ApplicationOptions } from 'bind-rest';
import { createBindRestContext, createNormalizeResponse } from './lib';
import { AwsProxyAsyncEventHandler } from './interfaces';

export * from './consts';

const debug = require('debug')('bind:rest:aws:lambda');

const TAG = 'CREATE_HANDLER';

let app: Application;

debug('Required bind-rest-aws-lambda index');

const createHandlerAsync = (
  applicationOptions: ApplicationOptions,
): AwsProxyAsyncEventHandler => async (
  event: APIGatewayEvent | APIGatewayProxyEventV2,
  context: LambdaContext,
): Promise<APIGatewayProxyStructuredResultV2> => {
  const isColdStart = !app;
  debug('%s Using createHandlerAsync isColdStart=%s', TAG, isColdStart);
  const normalizeResponse = createNormalizeResponse(applicationOptions.maxBodySize);
  if (isColdStart) {
    debug('%s app NOT_INITIALIZED event=%j context=%j', TAG, event, context);
    app = new Application(applicationOptions);
    await app.init();
  }
  debug('%s app IS_INITIALIZED. event=%j context=%j app=%o', TAG, event, context, app);
  return app
    .getAppResponse(createBindRestContext(event, context, isColdStart))
    .then(normalizeResponse)
    .catch((e) => {
      debug(
        '% Error in getting serverResponse. Returning error response 400. error=%s e=%o',
        TAG,
        e.message,
        e,
      );
      return {
        statusCode: 400,
        body: `Error processing request. ${e.message}`,
      };
    });
};

export default createHandlerAsync;
