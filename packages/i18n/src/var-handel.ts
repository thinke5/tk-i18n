import { StrAst, VarHandle } from './type';
import { splitString } from './utils';

/** 如何处理变量，按倒序调用 */
const handles: VarHandle[] = [];
/** 获取所有处理函数 */
export function getVarHandles() {
  return handles;
}
/** 新增处理函数 */
export function pushVarHandle(...v: VarHandle[]) {
  return handles.push(...v);
}
/** 获取合适的处理函数 */
export function getVarHandle(varStr: string) {
  let res: StrAst;
  for (let i = handles.length - 1; i >= 0; i--) {
    const handle = handles[i];
    const v = handle.separate(varStr);
    if (v) {
      res = v;
      break;
    }
  }
  return res!;
}

/** 最基础的变量
 * @example `{name}` => param.name
 */
const baseVarHandel: VarHandle = {
  type: 'var',
  separate: (str) => ({
    type: 'var',
    value: str,
    toString: () => addTemple(`param.${str}`),
    varName: str,
  }),
};

/** 含有处理函数 的变量
 * @description 可以是任意 `js全局函数` 或 `文件内的字段` 或 `方法`
 * @example 1 `{name|..length}` => param.name.length
 * @example 2 `{name|>length(#)}` => length(param.name)
 * @example 3 `{name|..length|>sum(#,2)}` => sum(param.name.length,2)
 */
export const VarHaveHandel: VarHandle = {
  type: 'var-handle',
  separate: (str) => {
    const [name, ...handleStr] = splitString(str, '|');
    if (str.includes('|.') || str.includes('|>')) {
      return {
        type: 'var-handle',
        value: str,
        toString: () => {
          return addTemple(pipeline('param.' + name, handleStr));
        },
        varName: name,
      };
    }
    return null;
  },
};

/** 含有自身文件内 的变量
 * @description 支持处理函数
 * @example 1 `{@key}` => key()
 * @example 2 `{@key|..lenght}` => key().lenght
 * @example 2 `{@key|>sum(#)}` => sum(key())
 */
export const VarThis: VarHandle = {
  type: 'var-this',
  separate: (str) => {
    if (/^\@/.test(str)) {
      const v = str.slice(1);
      const [name, ...handleStr] = splitString(v, '|');
      return {
        type: 'var-this',
        value: str,
        toString: () => {
          // todo param传递
          let res = `${v}()`;

          if (handleStr.length > 0) {
            res = pipeline(`${name}()`, handleStr);
          }

          return addTemple(res);
        },
      };
    }
    return null;
  },
};

pushVarHandle(baseVarHandel, VarHaveHandel, VarThis);

/** 处理管道 */
function pipeline(base: string, handleStr: string[]) {
  let res = base;
  for (const str of handleStr) {
    if (/^\./.test(str)) {
      res += str.slice(1);
    }
    if (/^\>/.test(str)) {
      res = str.slice(1).replace('#', res);
    }
  }

  return res;
}

function addTemple(str: string) {
  return '${' + str + '}';
}
