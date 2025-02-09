import { Cmd } from 'redux-loop';
import { fetchCatsCommit, fetchCatsRollback } from './actions';
import { FetchCatsRequest } from './types/actions.type';
import { Picture } from './types/picture.type';

export const cmdFetch = (action: FetchCatsRequest) =>
  Cmd.run(
    async () => {
      const response = await fetch(action.path, { method: action.method });
      checkStatus(response);
      const data = await response.json();
      if (!data.hits) throw new Error("Invalid API response: missing 'hits'");
      return data.hits.map((hit: any): Picture => ({
        previewFormat: hit.previewURL,
        webFormat: hit.webformatURL,
        largeFormat: hit.largeImageURL,
        author: hit.user,
      }));
    },
    {
      successActionCreator: fetchCatsCommit, // (equals to (payload) => fetchCatsCommit(payload))
      failActionCreator: fetchCatsRollback, // (equals to (error) => fetchCatsCommit(error))
    },
  );

const checkStatus = (response: Response) => {
  if (response.ok) return response;
  throw new Error(response.statusText);
};
