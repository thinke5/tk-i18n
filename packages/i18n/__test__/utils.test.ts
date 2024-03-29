import { expect, test } from 'vitest';
import { splitString } from '../src/utils';

test('splitString base', () => {
  expect(splitString(`111'v'333'v'555'v'`, '|')).toMatchInlineSnapshot(`
    [
      "111'v'333'v'555'v'",
    ]
  `);
  expect(splitString(`1|11'v'33|3'v|v'555'v'`, '|')).toMatchInlineSnapshot(`
    [
      "1",
      "11'v'333'v|v'555'v'",
    ]
  `);
  expect(splitString(`xxd|fdsfs()|t().join('|')`, '|')).toMatchInlineSnapshot(`
    [
      "xxd",
      "fdsfs()",
      "t().join('|')",
    ]
  `);
  expect(splitString(`xxd|fdsfs()|t().join('ad|')`, '|')).toMatchInlineSnapshot(`
    [
      "xxd",
      "fdsfs()",
      "t().join('ad|')",
    ]
  `);
  expect(splitString(`xxd|fdsfs(213)|t().join('ad|cd')`, '|')).toMatchInlineSnapshot(`
    [
      "xxd",
      "fdsfs(213)",
      "t().join('ad|cd')",
    ]
  `);
  expect(splitString(`xxd|fdsfs(213)|t().join('|cd')`, '|')).toMatchInlineSnapshot(`
    [
      "xxd",
      "fdsfs(213)",
      "t().join('|cd')",
    ]
  `);
});
