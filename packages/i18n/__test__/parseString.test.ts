import { expect, test } from 'vitest';
import { parseString } from '../src/parseString';

test('parseString base', () => {
  const list = [
    '你好，世界🌍',
    '你好，{name}',
    '你好，{name}!',
    '你好，{name|..length}',
    "你好，{name|>va(#,'ddd')}",
    "你|好，{name|>va(#,'ddd')}",
    '你好，{@key}',
  ];
  list.forEach((str) => {
    expect(parseString(str)).toMatchSnapshot(str);
  });
});
