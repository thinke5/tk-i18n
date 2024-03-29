import { Ast, StrAst } from './type';
import { getVarHandle } from './var-handel';

const reg = /(\{[^}]+\})/g;
const varTag = '$var$';

export function parseString(str: string) {
  const vars: string[] = [];
  const rt: Ast = [];
  str
    .replace(reg, (v) => {
      vars.push(getVarName(v));
      return varTag;
    })
    .split(varTag)
    .filter(Boolean)
    .forEach((txt, i) => {
      rt.push({
        type: 'text',
        value: txt,
        toString() {
          return txt;
        },
      });
      if (vars[i]) {
        rt.push(getVarHandle(vars[i]));
      }
    });

  return rt;
}

/** 移除 { } */
function getVarName(str: string) {
  return str.slice(1, -1);
}
