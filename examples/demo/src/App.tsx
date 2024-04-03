import { createSignal } from 'solid-js';
import './App.css';
import solidLogo from './assets/solid.svg';
import { adapter, defaultLanguage, i18n, setLanguage } from './i18n';

import viteLogo from '/vite.svg';

adapter(...createSignal(defaultLanguage));

function App() {
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
        <button onClick={() => setLanguage('zh')}>zh</button>
        <button onClick={() => setLanguage('en')}>en</button>
        <p>{i18n.hello2({ age: 12 })}</p>
        <p>
          {i18n.description()} -- {i18n.name()}
        </p>
      </div>
      <p class="read-the-docs">Click on the Vite and Solid logos to learn more</p>
    </>
  );
}

export default App;
