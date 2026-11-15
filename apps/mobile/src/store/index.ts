import { combineReducers, configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore, FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import NetInfo from '@react-native-community/netinfo';
import requirements from './requirementsSlice';
import network, { setOnline } from './networkSlice';
import { syncListener } from './syncMiddleware';

const rootReducer = combineReducers({ requirements, network });
const persisted = persistReducer({ key: 'root', storage: AsyncStorage, whitelist: ['requirements'] }, rootReducer);

export const store = configureStore({
  reducer: persisted,
  middleware: (gdm) => gdm({ serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] } })
    .prepend(syncListener.middleware),
});
export const persistor = persistStore(store, null, () => {
  // after rehydrate: anything left 'syncing' from a killed app → back to pending
  store.dispatch({ type: 'noop' });
});

NetInfo.addEventListener((s) => {
  store.dispatch(setOnline(!!s.isConnected && s.isInternetReachable !== false));
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
