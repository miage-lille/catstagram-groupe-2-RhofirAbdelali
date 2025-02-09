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
  pictureSelected: Option<Picture>;
};
 
export const defaultState: State = {
  counter: 3,
  pictures: { status: 'loading' }, 
  pictureSelected: none,
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
        return { ...state, pictureSelected: some(action.picture) };
    case 'CLOSE_MODAL':
      return { ...state, pictureSelected: none };
    case 'FETCH_CATS_REQUEST':
      return loop({ ...state, pictures: { status: 'loading' } }, cmdFetch(action));
    case 'FETCH_CATS_COMMIT':
      return { ...state, pictures: { status: 'success', pictures: action.payload } };
    case 'FETCH_CATS_ROLLBACK':
      return { ...state, pictures: { status: 'failure', error: action.error.message } };
  }
};

export const counterSelector = (state: State) => {
  return state.counter; 
};
export const picturesSelector = (state: State) => {
  return state.pictures;
};
export const getSelectedPicture = (state: State) => {
  return state.pictureSelected;
};

export default compose(liftState, reducer);
