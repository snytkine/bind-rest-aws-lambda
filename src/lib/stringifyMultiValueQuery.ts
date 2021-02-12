// @ts-ignore
/**
 * convert multiValueQuery and convert into query string
 * @param multivalueQuery
 */
const multiValueQueryStringParameters = (multivalueQuery?: NodeJS.Dict<string[]>): string => {
  if (!multivalueQuery) {
    return '';
  }

  const entries = Object.entries(multivalueQuery);

  const ret = entries.reduce((acc, next) => {
    const key = next[0];
    const val = next[1].join(`&${key}=`);

    return `${acc}&${key}=${val}`;
  }, '');

  return ret;
};

export default multiValueQueryStringParameters;
