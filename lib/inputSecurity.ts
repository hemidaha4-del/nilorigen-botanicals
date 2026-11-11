export function sanitizePlainText(value: string, allowLineBreaks = false): string {
  const controlCharacters = allowLineBreaks
    ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g
    : /[\u0000-\u001F\u007F]/g;
  return value.replace(controlCharacters, '').trim();
}
