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
export const currentLanguage = () => _currentLanguage;

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
export const setLanguageTag = (tag) => {
  if (typeof tag === 'function') {
    _currentLanguage = tag(_currentLanguage);
  } else {
    _currentLanguage = tag;
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

// ------ TYPES ------

/**
 * A language tag that is available in the project.
 *
 * @example
 *   setLanguageTag(request.languageTag as availableLanguage)
 *
 * @typedef {typeof availableLanguage[number]} AvailableLanguage
 */
