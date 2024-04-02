export type StrAst = {
  type: string;
  value: string;
  toString: () => string;
  // state?: any;
  varName?: string;
};

export type Ast = StrAst[];

export type VarHandle = {
  type: string;
  /** 如何区分 */
  separate: (str: string) => null | StrAst;
};

export type Config = {
  language: string[];
  defaultLanguage: string;
  inputDir?: string;
  outputDir?: string;
  dynamicLanguage?: string[];
};
export type KeyVars = { [k: string]: string[] };
export type AllKeys = { [key: string]: { [lang: string]: KeyValue } };
export type KeyValue = {
  value: string;
  vars: string[];
  raw: any;
};
