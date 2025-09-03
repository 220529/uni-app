/**
 * 生成 0 到 n 的随机整数（包含 0 和 n）
 * @param {number} n - 最大值（包含）
 * @returns {number} 随机整数（0 到 n）
 */
export function getRandomInt(n) {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error('n 必须是非负整数');
  }
  return Math.floor(Math.random() * (n + 1));
}
