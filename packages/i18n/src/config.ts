import { cwd } from 'node:process';
import { readJsonFile } from './utils/readJsonFile';
import { Config } from './type';

const measageDir = 'messages';

let _config: Required<Config>;
/** 获取所有配置 */
export async function getConfig() {
  const basePath = cwd();
  if (!_config) {
    const config = await readJsonFile<Config>(basePath, 'i18n.config');

    let {
      language,
      defaultLanguage,
      inputDir = measageDir,
      outputDir = './src/i18n',
      dynamicLanguage = [],
      multipleFilesLanguage = {},
    } = config;
    if (!language) {
      console.error('config language is empty');
      process.exit(2);
    }
    if (!defaultLanguage) {
      defaultLanguage = language[0]; // 默认取第一个语言
    }
    _config = {
      language,
      defaultLanguage,
      inputDir,
      outputDir,
      dynamicLanguage,
      multipleFilesLanguage,
    };
  }

  return _config;
}

/** 是否存在动态增加的语言 */
export async function hasDynamicLanguage() {
  return (await getConfig()).dynamicLanguage.length > 0;
}
/** 获取所有语言，包含动态语言 */
export async function getAllLanguageList() {
  const config = await getConfig();
  return config.language.concat(...config.dynamicLanguage);
}
