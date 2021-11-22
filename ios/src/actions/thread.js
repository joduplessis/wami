import { hydrateMessages, error } from "./";
import Realm from "realm";
import { UnreadSchema } from "../schemas";

export function hydrateThread(thread) {
  return dispatch => {
    // Open realm and keep it open
    Realm.open({
      schema: [UnreadSchema]
    })
      .then(realm => {
        const { kind, _id } = thread;
        const unread = realm
          .objects("Unread")
          .filtered(`kind == "${kind}" && _id == "${_id}"`);

        if (unread) {
          realm.write(() => {
            //realm.delete(unread);
          });
        }
      })
      .catch(err => {
        dispatch(error(err));
      });

    // NB: We can potentially get rid of this if we use Firebase
    dispatch(hydrateMessages(thread));
    dispatch({
      type: "THREAD",
      payload: thread
    });
  };
}
