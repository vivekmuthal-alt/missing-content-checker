export function compareText(docText, siteText) {
  const docLines = docText.split('\n').filter(l => l.trim());
  const siteLines = siteText.split('\n').filter(l => l.trim());

  let matchedLines = [];
  let missingLines = [];
  let extraLines = [];

  // Check site lines against doc
  siteLines.forEach((line) => {
    if (docLines.includes(line)) {
      matchedLines.push(line);
    } else {
      extraLines.push(line);
    }
  });

  // Find missing lines
  docLines.forEach((line) => {
    if (!siteLines.includes(line)) {
      missingLines.push(line);
    }
  });

  return {
    matched: matchedLines,
    missing: missingLines,
    extra: extraLines
  };
}
