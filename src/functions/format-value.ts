
export function formatValue<T = any>(value: any): T | string | number | boolean {
  if (typeof value === 'string') {
    return `'${value}'`;
  } else if (typeof value === 'number') {
    return value;
  } else if (typeof value === 'boolean') {
    return value;
  } else if (Array.isArray(value)) {
    return value.map(item => formatValue(item)).join(',');
  } else if (typeof value === 'object') {
    return JSON.stringify(value);
  } else {
    return value;
  }
}
