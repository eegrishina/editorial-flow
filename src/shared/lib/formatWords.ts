export const formatWords = (n: number): string => {
  return n >= 1000
    ? (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "k"
    : String(n);
};
