// test-utils.js
import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';

import store from './store';

function render(ui, renderOptions) {
  const wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;
  return rtlRender(ui, { wrapper, ...renderOptions })
}

// re-export everything
export * from '@testing-library/react'
// override render method
export { render }
