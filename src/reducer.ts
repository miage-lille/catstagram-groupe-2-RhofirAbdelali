import { Loop, liftState, loop, Cmd } from 'redux-loop';
import { compose } from 'redux';
import { Actions } from './types/actions.type';
import { Picture } from './types/picture.type';
import { Option, none, some } from 'fp-ts/Option';
import { cmdFetch } from './commands';
import { fetchCatsRequest } from './actions';
import { ApiState } from './types/api.type';

export type State = {
  counter: number;
  pictures: ApiState;
  selectedPicture: Option<Picture>;
};
 
export const defaultState: State = {
  counter: 3,
  pictures: { status: 'loading' }, 
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
      return loop({ ...state, pictures: { status: 'loading' } }, cmdFetch(action));
    case 'FETCH_CATS_COMMIT':
      return { ...state, pictures: { status: 'success', pictures: action.payload } };
    case 'FETCH_CATS_ROLLBACK':
      return { ...state, pictures: { status: 'failure', error: action.error.message } };
  }
};

export const counterSelector = (state: State) => {
  return Math.max(3, state.counter);
};
export const picturesSelector = (state: State) => {
  if (state.pictures.status === 'success') {
    return state.pictures.pictures.slice(0, state.counter);
  }
  return [];
};
export const getSelectedPicture = (state: State) => {
  return state.selectedPicture;
};

export default compose(liftState, reducer);
