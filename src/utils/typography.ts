const CHARACTER_MAP: Record<string, string> = {
  "\u201C": '"',
  "\u201D": '"',
  "\u201E": '"',
  "\u201F": '"',
  "\u2018": "'",
  "\u2019": "'",
  "\u201A": "'",
  "\u201B": "'",
  "\u2014": "-",
  "\u2013": "-",
  "\u2026": "...",
};

const smartCharPattern = new RegExp(Object.keys(CHARACTER_MAP).join("|"), "g");

export const normalizeCopy = (input: string): string =>
  smartCharPattern.test(input)
    ? input.replace(smartCharPattern, (char) => CHARACTER_MAP[char] ?? char)
    : input;
