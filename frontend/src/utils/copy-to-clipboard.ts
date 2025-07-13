export async function copyToClipboard(textToCopy: string) {
  return await navigator.clipboard.writeText(textToCopy);
}
