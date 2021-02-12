const normalizeMultiValues = (
  multiValues: NodeJS.Dict<string[]>,
): NodeJS.Dict<string | string[]> => {
  const entries = Object.entries(multiValues);
  return entries.reduce((acc, next) => {
    if (next[1].length < 2) {
      // eslint-disable-next-line prefer-destructuring
      acc[next[0]] = next[1][0];
    } else {
      // eslint-disable-next-line prefer-destructuring
      acc[next[0]] = next[1];
    }

    return acc;
  }, {});
};

export default normalizeMultiValues;
