/**
 * Turn multiValueHeaders in string => string|string[]
 * but also convert header names to lower case
 * @param multiValues
 */
const normalizeMultiValues = (
  multiValues: NodeJS.Dict<string[]>,
): NodeJS.Dict<string | string[]> => {
  const entries = Object.entries(multiValues);
  return entries.reduce((acc, next) => {
    const [headerName, headerValue] = next;
    if (headerValue.length < 2) {
      // eslint-disable-next-line prefer-destructuring
      acc[headerName.toLowerCase()] = headerValue[0];
    } else {
      // eslint-disable-next-line prefer-destructuring
      acc[headerName.toLowerCase()] = headerValue;
    }

    return acc;
  }, {});
};

export default normalizeMultiValues;
