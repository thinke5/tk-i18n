import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import * as path from 'node:path';
import { cwd } from 'node:process';
import { fileURLToPath } from 'node:url';
import { getAllLanguageList, getConfig, hasDynamicLanguage as hasDynamicLanguageFn } from './config';
import { handleVarsAny } from './json2string';
import { AllKeys } from './type';
import { emptyDir } from './utils';
import { readLangFilesToJson } from './utils/readJsonFile';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const measageDir = 'messages';
const eslint_disable = '/* eslint-disable */\n';

export async function run() {
  console.log('start i18n');

  const basePath = cwd();

  const { language, defaultLanguage, outputDir = './src/i18n', dynamicLanguage = [] } = await getConfig();
  /** 是否存在动态增加的语言 */
  const hasDynamicLanguage = await hasDynamicLanguageFn();

  const allLanguage = await getAllLanguageList();

  const langMsgPath = path.resolve(basePath, outputDir, measageDir);
  emptyDir(langMsgPath);
  await mkdir(langMsgPath, { recursive: true });

  const allKeys: AllKeys = {};
  // cin
  for (const lang of allLanguage) {
    const json = await readLangFilesToJson(lang);

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
    ...language.map((l) => `import * as ${l} from './${measageDir}/${l}.mjs';`),
    `import { currentLanguage${hasDynamicLanguage ? ', dynamicLanguage' : ''} } from './runtime.mjs';`,
  ].join('\n');
  Object.entries(allKeys).forEach(([key, value]) => {
    // lang
    allLanguage.forEach((lang) => {
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
    mainMsgs += toMainMsg({ hasDynamicLanguage, key, language, vars: allVars, allKeys, defaultLanguage });
  });
  // 写入 runtime
  readFile(path.resolve(__dirname, '../files/runtime.mjs'))
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
  writeDynamicLanguage(langMsgPath, dynamicLanguage);
  // end
  console.log('end i18n');
}

function toMainMsg(param: {
  vars: string[];
  key: string;
  language: string[];
  allKeys: AllKeys;
  defaultLanguage: string;
  hasDynamicLanguage?: boolean;
}) {
  const hasVar = param.vars.length > 0;

  return [
    '\n\n/**',
    ...param.language.map(
      (lang) => ` * @lang_${lang} \`\`\`\n * ${JSON.stringify(param.allKeys[param.key][lang]?.raw)}\n * \`\`\``
    ),
    ' *',
    varsTmpString(param.vars),
    ` * @param {{ lang?: ${param.language.map((l) => `"${l}"`).join('|')} }} options`,
    ' */',
    '/* @__NO_SIDE_EFFECTS__ */',
    `export const ${param.key} = (param, options = {}) => {`,
    '  const lang = options.lang || currentLanguage();',
    // param.language.map((l) => `  if (lang === "${l}") return ${l}.${param.key}(${hasVar ? 'param' : ''});`).join('\n'),
    // `  return ${param.defaultLanguage}.${param.key}(${hasVar ? 'param' : ''});`,
    '  const langs = {',
    param.language.map((l) => `    ${l}: ${l}.${param.key},`).join('\n'),
    param.hasDynamicLanguage ? `    ...dynamicLanguage('${param.key}'),` : '', // 是否开启 动态增加语言
    `  };`,
    `  return (langs[lang] || langs.${param.defaultLanguage})(${hasVar ? 'param' : ''});`,
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
    ' *',
    varsTmpString(param.vars),
    ' */',
    '/* @__NO_SIDE_EFFECTS__ */',
    `export const ${param.key} = (${hasVar ? 'param' : ''}) => ${param.value};`,
  ]
    .filter(Boolean)
    .join('\n');
}

/** 生成动态引入语言的工具函数 */
async function writeDynamicLanguage(_path: string, dynamicLanguage: string[]) {
  const str = [
    //
    eslint_disable,
    "import { addDynamicLanguage } from './runtime.mjs';",
    dynamicLanguage.map(
      (lang) =>
        `/** dynamic add language ${lang} */\nexport const addLanguage_${lang} = async () => await import('./${measageDir}/${lang}.mjs').then((value) => addDynamicLanguage('${lang}', value));`
    ),
  ].join('\n');
  writeFile(path.resolve(_path, `../dynamic.mjs`), str);
}

async function writeMainMsg(_path: string, str: string) {
  writeFile(path.resolve(_path, `../.gitignore`), '*');
  writeFile(path.resolve(_path, `../.prettierignore`), '*');
  ['index.mjs', 'index.d.ts', 'message.d.ts', 'runtime.d.ts', 'dynamic.d.ts'].forEach((v) =>
    copyFile(path.resolve(__dirname, '../files/', v), path.resolve(_path, `../`, v))
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

function varsTmpString(vars: string[]) {
  const hasVar = vars.length > 0;
  return [
    hasVar ? ` * @template {{${vars.map((v) => v + ': any;').join(' ')} }} T` : '',
    hasVar ? ` * @param {T} param` : ' * @param {{}} [param]',
  ]
    .filter(Boolean)
    .join('\n');
}
