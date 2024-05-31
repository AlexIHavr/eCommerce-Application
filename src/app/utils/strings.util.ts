export function capitalizeFirstLetter(text: string): string {
  return text[0].toUpperCase() + text.slice(1);
}

export function createQueryStringForFilter(strings: string[]): string {
  return strings.map((string) => `"${string}"`).join(', ');
}
