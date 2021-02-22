import { IBindRestContext } from 'bind-rest/build/types/lib/interfaces/icontext';
import { Middleware } from 'bind-rest';
import { AwsLambdaContextV2 } from '../components';

const debug = require('debug')('bind:rest:aws:lambda');

export const isAwsLambdaContextV2Context = (
  context: IBindRestContext,
): context is AwsLambdaContextV2 => {
  return context.contextType === 'AwsLambdaContextV2';
};

@Middleware
export class FixEvent2Path {
  private TAG = 'Middleware_FixEvent2Path';

  doFilter(context: IBindRestContext | AwsLambdaContextV2): Promise<IBindRestContext> {
    if (isAwsLambdaContextV2Context(context)) {
      debug('%s in doFilter. context is V2', this.TAG);
      if (
        context.apiGatewayEvent.requestContext.stage !== '$default' &&
        context.apiGatewayEvent.requestContext.http.path.startsWith(
          `/${context.apiGatewayEvent.requestContext.stage}`,
        )
      ) {
        // Remove first n chars from path where n is length of stage + 1 (one for the leasing slash is path)
        context.path = context.apiGatewayEvent.requestContext.http.path.substr(
          context.apiGatewayEvent.requestContext.stage.length + 1,
        );
        debug(
          '%s Updated path from %s to %s',
          this.TAG,
          context.apiGatewayEvent.requestContext.http.path,
          context.path,
        );
      }
    }

    return Promise.resolve(context);
  }
}
