import { addDynamicLanguage } from './runtime.mjs';
export const dynamic = async () => await import('__dynamic__').then((value) => addDynamicLanguage('__dynamic__', value));
