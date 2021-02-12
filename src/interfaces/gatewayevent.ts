import { APIGatewayEvent, APIGatewayProxyEventV2 } from 'aws-lambda';

export type IAWSGatewayEvent = APIGatewayEvent | APIGatewayProxyEventV2;
