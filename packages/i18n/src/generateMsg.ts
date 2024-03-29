export function generateMrg(param: { data: object; keys: string[]; langs: string[] }) {
  const { data, keys, langs } = param;
  const result = '';
  keys.forEach((key) => {
    return [
      //
      '/**',
      ' */',
      '/* @__NO_SIDE_EFFECTS__ */',
      `export const ${key} = (param = {}) => {`,

      '}',
    ].join('\n');
  });
  return '';
}
