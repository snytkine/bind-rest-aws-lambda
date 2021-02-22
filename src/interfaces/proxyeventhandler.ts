import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
  Context,
} from 'aws-lambda';

export type AwsProxyAsyncEventHandler = (
  event: APIGatewayProxyEvent | APIGatewayProxyEventV2,
  context: Context,
) => Promise<APIGatewayProxyStructuredResultV2>;
