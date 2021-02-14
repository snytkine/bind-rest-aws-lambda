import { APIGatewayEvent, APIGatewayProxyResult, Context as LambdaContext } from 'aws-lambda';
import { Application, ApplicationOptions } from 'bind-rest';
import { AwsLambdaContext } from './components';
import { createNormalizeResponse } from './lib';

export * from './consts';

const debug = require('debug')('bind:rest:aws:lambda');

let app: Application;

debug('Required bind-rest-aws-lambda index');

const createHandlerAsync = (applicationOptions: ApplicationOptions): Function => async (
  event: APIGatewayEvent,
  context: LambdaContext,
): Promise<APIGatewayProxyResult> => {
  const isColdStart = !app;
  debug('Using createHandlerAsync isColdStart=%s', isColdStart);
  const normalizeResponse = createNormalizeResponse(applicationOptions.maxBodySize);
  if (isColdStart) {
    debug('app NOT_INITIALIZED event=%j context=%j', event, context);
    app = new Application(applicationOptions);
    await app.init();
  }
  debug('app IS_INITIALIZED. event=%j context=%j app=%o', event, context, app);
  return app
    .getAppResponse(new AwsLambdaContext(event, context, isColdStart))
    .then(normalizeResponse);
};

export default createHandlerAsync;
