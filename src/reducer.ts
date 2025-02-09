import { Loop, liftState, loop, Cmd } from 'redux-loop';
import { compose } from 'redux';
import { Actions } from './types/actions.type';
import { Picture } from './types/picture.type';
import { Option, none, some } from 'fp-ts/Option';
import { cmdFetch } from './commands';
import { fetchCatsRequest } from './actions';

export type State = {
  counter: number;
  pictures: Picture[];
  selectedPicture: Option<Picture>;
};
 
export const defaultState: State = {
  counter: 3,
  pictures: [],
  selectedPicture: none,
};

export const reducer = (state: State | undefined, action: Actions): State | Loop<State> => {
  if (!state) return defaultState; // mandatory by redux
  switch (action.type) {
    case 'INCREMENT':
      const newCounterIncrement = state.counter + 1;
      return loop(
        { ...state, counter: newCounterIncrement },
        Cmd.action(fetchCatsRequest(newCounterIncrement))
      );
    case 'DECREMENT':
      const newCounterDecrement = Math.max(3, state.counter - 1);
      return loop(
        { ...state, counter: newCounterDecrement },
        Cmd.action(fetchCatsRequest(newCounterDecrement))
      );
    case 'SELECT_PICTURE':
        return { ...state, selectedPicture: some(action.picture) };
    case 'CLOSE_MODAL':
      return { ...state, selectedPicture: none };
    case 'FETCH_CATS_REQUEST':
      return loop(state, cmdFetch(action));
    case 'FETCH_CATS_COMMIT':
      throw 'Not Implemented';
    case 'FETCH_CATS_ROLLBACK':
      throw 'Not Implemented';
  }
};

export const counterSelector = (state: State) => {
  return Math.max(3, state.counter);
};
export const picturesSelector = (state: State) => {
  return state.pictures.slice(0, state.counter);
};
export const getSelectedPicture = (state: State) => {
  return state.selectedPicture;
};

export default compose(liftState, reducer);
