export function getPlural(count: number, word: string, pluralizedWord: string) {
  return count > 1 ? word : pluralizedWord;
}
