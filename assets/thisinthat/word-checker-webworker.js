/*  Split a string by any of the characters in another string.
    Delimiters are included in the result, but empty strings are not.
*/
function splitByMultiple(stringToSplit, delimiters) {
  // Characters with special meaning in regexes must be prepended with a backslash
  const escapedDelimiters = delimiters.replace(/[-.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`([${escapedDelimiters}])`);
  // Empty strings come from adjacent delimiters, omit them
  return stringToSplit.split(regex).filter(s => s !== "");
}

/*  When worker is called,
    do computation and send results back
*/
onmessage = (event) => {
    const textToCheck = event.data.textToCheck;
    const wordListText = event.data.wordListText;
    const separatorsText = event.data.separatorsText;
    const caseSensitive = event.data.caseSensitive;

    // Split both strings to create arrays for comparison
    const splitsToCheck = splitByMultiple(textToCheck, separatorsText);
    const splitsOfWordList = splitByMultiple(wordListText, separatorsText);

    // Force unique entries in word list to reduce computation
    const caseSensitiveSet = new Set(splitsOfWordList);

    // Handle case sensitivity
    let wordListSet = caseSensitiveSet;
    if(!caseSensitive) {
        wordListSet = new Set(caseSensitiveSet.values().map(item => item.toLowerCase()));
    }
    
    // Return splits and the information which splits were in both strings
    let annotatedText = [];
    for (const split of splitsToCheck) {
        annotatedText.push({
            substring: split,
            found: caseSensitive ? wordListSet.has(split) : wordListSet.has(split.toLowerCase())
        })
    }
    postMessage(annotatedText);
}