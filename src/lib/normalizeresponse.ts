import {IAppResponse, stringifyBody} from "bind-rest";
import {APIGatewayProxyResult} from "aws-lambda";
import flattenMultiValueHeaders from "./flattenmultivalueheaders";

const createNormalizeResponse = (maxBodySize?: number) => (response: IAppResponse): Promise<APIGatewayProxyResult> => {
  return stringifyBody(maxBodySize)(response).then(response => {

    return {
      statusCode: response.statusCode,
      headers: flattenMultiValueHeaders(response.headers),
      body: response.body,
    }
  })
}

export default createNormalizeResponse;
