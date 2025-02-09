import { Failure, Loading, Success } from "./types/api.type";
import { Picture } from "./types/picture.type";

export const loading = (): Loading => ({ status: 'loading' }); // TODO : Update this value !
export const success = (payload: Picture[]): Success => ({ status: 'success', pictures: payload }); // TODO : Update this value !
export const failure = (error: string): Failure => ({ status: 'failure', error }); // TODO : Update this value !
