import rootReducer from './reducers';
import { configureStore } from '@reduxjs/toolkit';
import { wateringEventsApi } from 'api/wateringEvents';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({
      serializableCheck: false,
      thunk: true,
    }).concat(wateringEventsApi.middleware),
  ],
});

export const persistor = persistStore(store);
