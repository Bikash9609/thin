export function getPlural(count: number, word: string, pluralizedWord: string) {
  return count > 1 ? word : pluralizedWord;
}

export function validateWordCount(text: string, maxWords: number) {
  // Remove leading and trailing whitespaces
  const trimmedText = text.trim();
  // Split the text into words
  const words = trimmedText.split(/\s+/);
  // Check if the number of words exceeds the maximum
  return words.length <= maxWords;
}

export function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/(?:^|\s)\w/g, function (match) {
    return match.toUpperCase();
  });
}
