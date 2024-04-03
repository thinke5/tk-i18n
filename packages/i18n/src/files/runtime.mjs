/* eslint-disable */

/** The project's default language  */
export const defaultLanguage = 'defaultLanguage';

/** The project's available language  */
export const availableLanguage = /** @type {const} */ (['defaultLanguage']);

/** @type { AvailableLanguage } */
let _currentLanguage = defaultLanguage;

/**
 * Get the current language
 *
 * @example
 *   if (languageTag() === "zh"){
 *     console.log("Germany 🇨🇳")
 *   } else if (languageTag() === "nl"){
 *     console.log("Netherlands 🇳🇱")
 *   }
 *
 * @type {() => AvailableLanguage }
 */
export let currentLanguage = () => _currentLanguage;

/**
 * Set the language tag.
 *
 * @example
 *
 *   // changing to language
 *   setLanguageTag("en")
 *
 *   // passing a getter function also works.
 *   //
 *   // a getter function is useful for resolving a language tag
 *   // on the server where every request has a different language tag
 *   setLanguageTag(() => {
 *     return request.langaugeTag
 *   })
 *
 * @param {AvailableLanguage  | ((lang: AvailableLanguage) => AvailableLanguage )} tag
 */
export let setLanguage = (tag) => {
  if (typeof tag === 'function') {
    _currentLanguage = tag(_currentLanguage);
  } else {
    _currentLanguage = tag;
  }
};

/**
 * @param {()=>string} getFn
 * @param {(v:string)=>void} [setFn]
 */
export const adapter = (getFn, setFn) => {
  currentLanguage = getFn;
  if (setFn) {
    setLanguage = setFn;
  }
};

/**
 * Check if something is an available language tag.
 *
 * @param {any} thing
 * @returns {thing is AvailableLanguage }
 */
export function isAvailableLanguage(thing) {
  return availableLanguage.includes(thing);
}

/**
 * @type { {[lang:string]: {[key:string]: Function }} }
 */
let _dynamicLanguages = {};

/**
 * get the dynamic language by key
 * @param {string} key
 */
export function dynamicLanguage(key) {
  return Object.fromEntries(Object.entries(_dynamicLanguages).map(([lang, value]) => [lang, value[key]]));
}

/**
 * add  dynamic language
 * @param {string} lang
 * @param {  {[key:string]: Function } } languageData
 */
export function addDynamicLanguage(lang, languageData) {
  _dynamicLanguages[lang] = languageData;
  availableLanguage.push(lang);
}

// ------ TYPES ------

/**
 * A language tag that is available in the project.
 *
 * @example
 *   setLanguageTag(request.languageTag as availableLanguage)
 *
 * @typedef {typeof availableLanguage[number]} AvailableLanguage
 */
