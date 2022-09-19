import { wateringEventsApi } from 'api/wateringEvents';
import { combineReducers } from 'redux';
import auth from 'stores/auth';

export default combineReducers({
  auth,
  [wateringEventsApi.reducerPath]: wateringEventsApi.reducer,
});
