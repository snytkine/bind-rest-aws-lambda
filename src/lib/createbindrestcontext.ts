import { APIGatewayEvent, APIGatewayProxyEventV2 } from 'aws-lambda';
import { IBindRestContext } from 'bind-rest/build/types/lib/interfaces/icontext';
import { Context as LambdaContext } from 'aws-lambda/handler';
import AwsLambdaContextV2 from '../components/lambdacontext_v2';
import { AwsLambdaContext } from '../components';

export function isV2Event(
  event: APIGatewayProxyEventV2 | APIGatewayEvent,
): event is APIGatewayProxyEventV2 {
  return (event as APIGatewayProxyEventV2).version === '2.0';
}

const createBindRestContext = (
  event: APIGatewayProxyEventV2 | APIGatewayEvent,
  context: LambdaContext,
  isColdStart: boolean = false,
): IBindRestContext => {
  if (isV2Event(event)) {
    return new AwsLambdaContextV2(event, context, isColdStart);
  }
  return new AwsLambdaContext(event, context, isColdStart);
};

export default createBindRestContext;
