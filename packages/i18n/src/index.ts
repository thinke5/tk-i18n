import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import * as path from 'node:path';
import { cwd } from 'node:process';
import { handleVarsAny } from './json2string';
import { AllKeys, Config } from './type';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const measageDir = 'messages';

export async function run() {
  console.log('start i18n');

  const basePath = cwd();
  const file = await readFile(path.resolve(basePath, 'i18n.config.json'));
  const config: Config = JSON.parse(file.toString());
  const { language, defaultLanguage, inputDir = measageDir, outputDir = './src/i18n' } = config;

  if (!language) {
    console.error('config language is empty');
    process.exit(2);
  }
  if (!defaultLanguage) {
    console.error('config defaultLanguage is empty');
    process.exit(2);
  }

  const langMsgPath = path.resolve(basePath, outputDir, measageDir);
  await mkdir(langMsgPath, { recursive: true });

  const allKeys: AllKeys = {};
  // cin
  for (const lang of language) {
    const filePath = path.resolve(basePath, inputDir, `${lang}.json`);
    const file = await readFile(filePath).catch((err) => {
      if (err.errno === -2) {
        console.error('!!! file not found: ' + filePath);
      }
    });
    let json: { [key: string]: string } = {};
    if (file) {
      json = JSON.parse(file.toString());
    }
    Object.entries(json).map(([key, value]) => {
      const v = handleVarsAny(value); // 处理字符串
      // 统计数据
      if (allKeys[key]) {
        allKeys[key][lang] = v;
      } else {
        allKeys[key] = { [lang]: v };
      }
    });
  }
  // handle msg
  const langMsgs: { [lang: string]: string } = {};
  let mainMsgs = [
    ...language.map((l) => `import * as ${l} from './messages/${l}.mjs';`),
    "import { currentLanguage } from './runtime.mjs';",
    '',
  ].join('\n');
  Object.entries(allKeys).forEach(([key, value]) => {
    // lang
    language.forEach((lang) => {
      if (langMsgs[lang] === undefined) {
        langMsgs[lang] = '';
      }
      // 生成各个语言文件
      if (value[lang]) {
        langMsgs[lang] += toLangMsg({ key, ...value[lang] });
      } else if (value[defaultLanguage] && lang !== defaultLanguage) {
        langMsgs[lang] += `\n\nexport { ${key} } from "./${defaultLanguage}.mjs"`;
      } else {
        //  默认语言 没有，查找其他第一个非空的
        const v = language.find((l) => value[l])!;
        langMsgs[lang] += toLangMsg({ key, ...value[v] });
      }
    });
    // all
    const allVars = Array.from(new Set(Object.values(value).map((v) => v.vars))).flat();
    mainMsgs += toMainMsg({ key, language, vars: allVars, allKeys, defaultLanguage });
  });
  // 写入 runtime
  readFile(path.resolve(__dirname, './files/runtime.mjs'))
    .then((res) =>
      res
        .toString()
        .replace(`'defaultLanguage'`, JSON.stringify(defaultLanguage))
        .replace(`['defaultLanguage']`, JSON.stringify(language))
    )
    .then((str) => writeFile(path.resolve(langMsgPath, `../runtime.mjs`), str));
  // 写入文件
  writeLangMsg(langMsgPath, langMsgs);
  writeMainMsg(langMsgPath, mainMsgs);
  // end
  console.log('end i18n');
}

function toMainMsg(param: {
  vars: string[];
  key: string;
  language: string[];
  allKeys: AllKeys;
  defaultLanguage: string;
}) {
  const hasVar = param.vars.length > 0;

  return [
    '\n\n/**',
    ...param.language.map(
      (lang) => ` * @lang_${lang} \`\`\`\n * ${JSON.stringify(param.allKeys[param.key][lang]?.raw)}\n * \`\`\``
    ),
    hasVar ? ` * @param {{ ${param.vars.map((v) => v + ': any;').join(' ')} }} param` : ' * @param { {} } [param]',
    ` * @param {{ languageTag?: ${param.language.map((l) => `"${l}"`).join('|')} }} options`,
    ' */',
    '/* @__NO_SIDE_EFFECTS__ */',
    `export const ${param.key} = (param, options = {}) => {`,
    '  const lang = options.languageTag || currentLanguage();',
    param.language.map((l) => `  if (lang === "${l}") return ${l}.${param.key}(${hasVar ? 'param' : ''});`).join('\n'),
    `  return ${param.defaultLanguage}.${param.key}(${hasVar ? 'param' : ''});`,
    '};',
  ]
    .filter(Boolean)
    .join('\n');
}

function toLangMsg(param: { value: string; vars: string[]; key: string }) {
  const hasVar = param.vars?.length > 0;
  return [
    '\n\n',
    '/** ```js',
    ' * ' + JSON.stringify(param.value),
    ' * ```',
    hasVar ? ` * @param {{ ${param.vars.map((v) => v + ': any;').join(' ')} }} param` : '',
    ' */',
    '/* @__NO_SIDE_EFFECTS__ */',
    `export const ${param.key} = (${hasVar ? 'param' : ''}) => ${param.value};`,
  ]
    .filter(Boolean)
    .join('\n');
}
const eslint_disable = '/* eslint-disable */\n';

async function writeMainMsg(_path: string, str: string) {
  writeFile(path.resolve(_path, `../.gitignore`), '*');
  writeFile(path.resolve(_path, `../.prettierignore`), '*');
  ['index.mjs', 'index.d.ts'].forEach((v) =>
    copyFile(path.resolve(__dirname, './files/', v), path.resolve(_path, `../`, v))
  );

  await writeFile(path.resolve(_path, `../message.mjs`), eslint_disable + str);
}

async function writeLangMsg(_path: string, msgs: { [lang: string]: string }) {
  for (const lang in msgs) {
    const str = msgs[lang];
    const msgFilePath = path.resolve(_path, `${lang}.mjs`);
    await writeFile(msgFilePath, eslint_disable + str);
  }
}
