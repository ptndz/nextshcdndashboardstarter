export function typeoOf(value: any) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}
