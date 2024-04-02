import fs from 'node:fs';

const splitSymbol = "'";
/** 更好的 split */
export function splitString(str: string, mark: string) {
  const resArr: string[] = [];
  const stp1 = str.split(splitSymbol).map((item, i) => (i % 2 ? item : item.split(mark)));

  for (let i = 0; i < stp1.length; i++) {
    if (typeof stp1[i] === 'string') {
      let txt = resArr.pop()! + splitSymbol + stp1[i] + splitSymbol;
      const next = stp1[i + 1];
      if (Array.isArray(next)) {
        txt += next.join('');
        stp1[i + 1] = []; // 取消下一个的处理
      }
      resArr.push(txt);
    } else {
      resArr.push(...stp1[i]);
    }
  }

  return resArr;
}

/**
 * 删除文件夹下所有问价及将文件夹下所有文件清空
 */
export function emptyDir(path: string) {
  const files = fs.readdirSync(path);
  files.forEach((file) => {
    const filePath = `${path}/${file}`;
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      emptyDir(filePath);
    } else {
      fs.unlinkSync(filePath);
    }
  });
}
