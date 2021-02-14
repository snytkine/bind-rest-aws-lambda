import { IResponseHeaders } from 'bind-rest';

/**
 * @todo to avoid having to call this function
 * we can disallow string[] in IResponseHeaders and allow only strings
 * That will be fine except for one case where response is coming as a result of http request (with makeRequest)
 * because the only header that may legitimately have multi-value headers is 'set-cookie', which is string[]
 *
 * If we make sure to flatten the headers in makeRequest then we will avoid calling this function
 * before passing every response to lambda. This would save on calling this function for every resposne
 * @param headers
 */
const flattenMultiValueHeaders = (headers: IResponseHeaders): NodeJS.Dict<string> => {
  const entries = Object.entries(headers);

  return entries.reduce((acc, next) => {
    if (Array.isArray(next[1])) {
      acc[next[0]] = `${next[1].join(',')}`;
    } else {
      acc[next[0]] = `${next[1]}`;
    }

    return acc;
  }, {});
};

export default flattenMultiValueHeaders;
