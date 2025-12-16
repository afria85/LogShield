export function isValidLuhn(input: string): boolean {
  const digits = input.replace(/\D/g, "");
  let sum = 0;
  let alt = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }

  return sum % 10 === 0;
}
