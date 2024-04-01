import { createSignal } from 'solid-js';
import './App.css';
import solidLogo from './assets/solid.svg';
import { availableLanguage, i18n, setLanguageTag } from './i18n';
import viteLogo from '/vite.svg';

function App() {
  const [count, setCount] = createSignal(0);

  const t = () => `${i18n.description()} -- ${i18n.name()} count is ${count()}`;
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} class="logo" alt="Vite logo" />
        </a>
        <a href="https://solidjs.com" target="_blank">
          <img src={solidLogo} class="logo solid" alt="Solid logo" />
        </a>
      </div>
      <h1>Vite + Solid</h1>
      <div class="card">
        <button
          onClick={() =>
            setCount((count) => {
              const next = count + 1;
              setLanguageTag(availableLanguage[next % availableLanguage.length]);
              return next;
            })
          }>
          {t()}
        </button>
        <p>{i18n.hello2({ age: 12 })}</p>
      </div>
      <p class="read-the-docs">Click on the Vite and Solid logos to learn more</p>
    </>
  );
}

export default App;
