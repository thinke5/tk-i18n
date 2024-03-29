import { parseString } from './parseString';
import { KeyValue } from './type';

export function handleVarsAny(value: any) {
  let res: KeyValue = { value, vars: [], raw: value };
  if (typeof value === 'string') {
    res = handleString(value);
  }
  if (Array.isArray(value)) {
    res = handleArray(value);
  }
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    res = hanleObject(value);
  }

  return res;
}

function hanleObject(obj: { [key: string]: any }): KeyValue {
  const vars = new Set<string>();
  let values: string[] = [];
  Object.entries(obj).forEach(([key, value]) => {
    const obj = handleVarsAny(value);
    obj.vars.forEach((v) => vars.add(v));

    values.push(`${key}: ${obj.value}`);
  });
  const value = `({${values.join(', ')}})`;
  return { value, vars: Array.from(vars), raw: obj };
}

function handleArray(arr: any[]): KeyValue {
  const vars = new Set<string>();
  let values: string[] = [];
  arr.forEach((str) => {
    const obj = handleVarsAny(str);
    obj.vars.forEach((v) => vars.add(v));

    values.push(obj.value);
  });
  const value = `([${values.join(', ')}])`;
  return { value, vars: Array.from(vars), raw: arr };
}

function handleString(str: string): KeyValue {
  let value = '';
  const vars = new Set<string>();
  parseString(str).forEach((item) => {
    value += item.toString();
    item.varName && vars.add(item.varName);
  });
  value = `\`${value}\``;
  return { value, vars: Array.from(vars), raw: str };
}
