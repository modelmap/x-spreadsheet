// formulaParser is a Parser object from the hot-formula-parser package
const cellRender = (src, formulaParser) => {
  let text = src;
  if (typeof src.text === 'string') text = src.text;
  let formula = src.formula || text.length > 1 && text[0] === '=' ? text.slice(1) : '';
  

  // If cell contains a formula, recursively parse that formula to get the value
  if (formula) {
    const parsedResult = formulaParser.parse(formula);
    const recursedSrc = (parsedResult.error) ?
            parsedResult.error :
            parsedResult.result;

    const parsedResultRecurse = cellRender({
      ...src,
      text: String(recursedSrc),
      value: recursedSrc,
      formula: null,
    }, formulaParser);
    return parsedResultRecurse;
  }

  if (typeof src.formatter === 'function') {
    text = src.formatter(src.value == undefined ? text : src.value)
  }

  // If cell doesn't contain a formula, render its content as is
  return { ...src, text };
};

export default {
  render: cellRender,
};
