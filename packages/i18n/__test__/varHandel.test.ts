import { expect, test } from 'vitest';
import { VarHaveHandel, VarThis } from '../src/var-handel';

const VarHaveHandel_okStr = [
  'namestr|..length',
  'namestr|>length(#)',
  'namestr|..length|.*2',
  'namestr|>length(#)|>sum(#)',
  'namestr|>length(#)|>sum(#,2)',
  'namestr|>length(#)|>sum(#,2)|..length',
  'namestr|>length(#)|>sum(#,2)|..length|>abs(#)',
];

test('VarHaveHandel separate', () => {
  const noStr = ['namestr', '@bfg'];
  noStr.forEach((str) => expect(VarHaveHandel.separate(str)).toBe(null));
  VarHaveHandel_okStr.forEach((str) => expect(VarHaveHandel.separate(str)).toBeTypeOf('object'));
});

test('VarHaveHandel toString', () => {
  VarHaveHandel_okStr.forEach((str) => {
    expect(VarHaveHandel.separate(str)!.toString()).toMatchSnapshot(str);
  });
});

const VarThis_okStr = [
  '@name',
  '@key',
  '@key|..lenght',
  '@key|>sum(#)',
  '@key|>sum(#)|..lenght',
  '@key|..lenght|>sum(#)',
];
const VarThis_noStr = ['name', 'ke@y'];

test('VarThis base', () => {
  VarThis_noStr.forEach((str) => expect(VarHaveHandel.separate(str)).toBe(null));

  VarThis_okStr.forEach((str) => {
    expect(VarThis.separate(str)!.toString()).toMatchSnapshot(str);
  });
});
