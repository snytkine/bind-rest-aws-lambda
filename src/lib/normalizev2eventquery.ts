import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';

const normalizeV2EventQuery = (
  query: APIGatewayProxyEventQueryStringParameters,
): NodeJS.Dict<string | string[]> => {
  const entries = Object.entries(query);

  return entries.reduce((acc, next) => {
    const [key, val] = next;
    if (val !== undefined) {
      const aValues = val.split(',');
      acc[key] = aValues.length > 1 ? aValues : aValues[0];
    }
    return acc;
  }, {});
};

export default normalizeV2EventQuery;
