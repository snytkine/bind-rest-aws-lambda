/**
 * convert multiValueQuery into query string
 * @param multivalueQuery
 */
const multiValueQueryStringParameters = (multivalueQuery?: NodeJS.Dict<string[]>): string => {
  if (!multivalueQuery) {
    return '';
  }

  const entries = Object.entries(multivalueQuery);

  return entries
    .map((next) => {
      const key = next[0];
      const val = next[1].join(`&${key}=`);

      return `${key}=${val}`;
    })
    .join('&');
};

export default multiValueQueryStringParameters;
