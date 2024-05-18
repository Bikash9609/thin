export function getPlural(count: number, word: string, pluralizedWord: string) {
  return count > 1 ? word : pluralizedWord;
}

export function getWordCount(text: string) {
  // Remove leading and trailing whitespaces
  const trimmedText = text.trim();
  // Split the text into words
  const words = trimmedText.split(/\s+/);
  // Return the number of words
  return words.length;
}

export function validateWordCount(text: string, maxWords: number) {
  // Check if the number of words exceeds the maximum
  return getWordCount(text) <= maxWords;
}

export function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/(?:^|\s)\w/g, function (match) {
    return match.toUpperCase();
  });
}
