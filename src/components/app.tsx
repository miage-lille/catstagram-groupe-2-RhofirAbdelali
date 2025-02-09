import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import Counter from './counter';
import Pictures from './pictures';
import ModalPortal from './modal';


const App = () => (
  <Provider store={store}>
    <>
      <Counter />
      <Pictures />
      <ModalPortal />
      <div>Hello World ! Go to build your Catstagram 💪 !</div>
    </>
  </Provider>
);

export default App;
