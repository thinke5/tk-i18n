import { i18n, availableLanguage, setLanguageTag } from './i18n';

export function setupCounter(element: HTMLButtonElement) {
  let counter = 0;
  const setCounter = (count: number) => {
    counter = count;
    setLanguageTag(availableLanguage[counter % availableLanguage.length]);
    element.innerHTML = i18n.name() + `  count is ${counter}`;
  };

  element.addEventListener('click', () => setCounter(counter + 1));
  setCounter(0);
}
