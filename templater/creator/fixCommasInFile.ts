export const fixCommasInFile = (lines: string[]): string[] => {

  const fileLines: string[] = [...lines];

  for (let i = 0; i < fileLines.length; i++) {
    const trimmedLine = fileLines[i].trimStart();

    if (trimmedLine[0] === ',') {
      fileLines[i] = fileLines[i].replace(',', '');

      const prevLine = fileLines[i - 1];

      if (prevLine) {
        const trimmedPrevLine = prevLine.trimEnd();

        if (trimmedPrevLine[trimmedPrevLine.length - 1] !== ',') {
          fileLines[i - 1] = fileLines[i - 1] + ',';
        }
      }
    }
  }

  return fileLines;
};
