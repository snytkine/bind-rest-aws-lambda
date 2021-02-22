import { IServerResponse, stringifyBody } from 'bind-rest';
import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

const createNormalizeResponse = (maxBodySize?: number) => (
  response: IServerResponse,
): Promise<APIGatewayProxyStructuredResultV2> => {
  return stringifyBody(maxBodySize)(response).then((responseWithBody: any) => {
    return {
      statusCode: responseWithBody.statusCode,
      headers: response.headers,
      body: responseWithBody.body,
      cookies: responseWithBody.cookies,
    };
  });
};

export default createNormalizeResponse;
