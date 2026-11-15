import './src/location/geofenceTask'; // ⚠️ must be first: defines the background task
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';
import { syncPendingRequirements } from './src/store/requirementsSlice';
import { RootNavigator } from './src/navigation/RootNavigator'; // your existing navigator

export default function App() {
  useEffect(() => { store.dispatch(syncPendingRequirements()); }, []);
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <RootNavigator />
      </PersistGate>
    </Provider>
  );
}
