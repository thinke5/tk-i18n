import json5 from 'json5';
import { glob } from 'glob';
import * as path from 'node:path';
import { readFile } from 'node:fs/promises';

const fileSuffix = ['jsonc', 'json5', 'json'].join(','); // 支持多个格式，最先找到的

/** 读取json文件，支持 jsonc、json5、json
 *
 * 存在同名不同格式时，按支持顺序的第一个
 * @param fileName 文件名, 不带后缀
 */
export async function readJsonFile<T = any>(filePath: string, fileName: string): Promise<T> {
  const file_path = path.resolve(filePath, `${fileName}.{${fileSuffix}}`);
  const [file_name] = await glob(file_path);
  if (!file_name) {
    throw new Error(`[i18n error] Can't find file ${file_name}`);
  }
  const file_str = (await readFile(file_name)).toString();
  return json5.parse(file_str);
}
