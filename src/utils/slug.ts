export function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9ぁ-んァ-ヶ一-龠]+/g, '-');
}
