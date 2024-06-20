// // store.ts
// import { configureStore } from '@reduxjs/toolkit';
// import rootReducer from './reducers'; // Your combined reducers
// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage'; // Use local storage

// const persistConfig = {
//   key: 'root',
//   storage,
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedReducer,
// });

// export const persistor = persistStore(store);


import { configureStore } from "@reduxjs/toolkit";
import { createStateSyncMiddleware, initMessageListener, initStateWithPrevTab } from "redux-state-sync";
import rootReducer from './reducers'; // Your combined reducers
import { BroadcastChannel } from 'broadcast-channel';

// const initialState = {}; // Define your initial state here

const reduxStateSyncConfig = {
  sync: true, // Enable state synchronization
  channel: 'atlantis_preview', // Specify a unique channel name
  broadcastChannelOption: { type: 'localstorage' }, // Use the Broadcast Channel API
};

const middleware = [createStateSyncMiddleware(reduxStateSyncConfig)];


const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(middleware),
});

// initMessageListener(store);
initStateWithPrevTab(store);
export default store;