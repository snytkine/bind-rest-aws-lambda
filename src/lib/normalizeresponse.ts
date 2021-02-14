import { IAppResponse, stringifyBody } from 'bind-rest';
import { APIGatewayProxyResult } from 'aws-lambda';
import flattenMultiValueHeaders from './flattenmultivalueheaders';

const createNormalizeResponse = (maxBodySize?: number) => (
  response: IAppResponse,
): Promise<APIGatewayProxyResult> => {
  return stringifyBody(maxBodySize)(response).then((responseWithBody) => {
    return {
      statusCode: responseWithBody.statusCode,
      headers: flattenMultiValueHeaders(responseWithBody.headers),
      body: responseWithBody.body,
    };
  });
};

export default createNormalizeResponse;
