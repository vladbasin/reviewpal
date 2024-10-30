import 'reflect-metadata';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Root } from '@reviewpal/web/ui';
import { enableMapSet } from 'immer';

enableMapSet();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <Root />
  </StrictMode>
);
