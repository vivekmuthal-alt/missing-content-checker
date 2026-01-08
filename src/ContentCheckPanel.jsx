const compareContent = () => {
  const docTokens = tokenize(docText);
  const siteTokens = tokenize(siteText);

  const results = [];
  let i = 0;
  let j = 0;

  while (i < docTokens.length || j < siteTokens.length) {
    const docWord = docTokens[i];
    const siteWord = siteTokens[j];

    if (
      docWord !== undefined &&
      siteWord !== undefined &&
      docWord.toLowerCase() === siteWord.toLowerCase()
    ) {
      results.push({
        left: docWord,
        right: siteWord,
        status: "matched"
      });
      i++;
      j++;
    } else {
      if (docWord !== undefined) {
        results.push({
          left: docWord,
          right: "",
          status: "missing"
        });
        i++;
      }

      if (siteWord !== undefined) {
        results.push({
          left: "",
          right: siteWord,
          status: "extra"
        });
        j++;
      }
    }
  }

  setResults(results);
};
