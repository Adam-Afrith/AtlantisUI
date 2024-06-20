// rootReducer.ts
// import { combineReducers } from '@reduxjs/toolkit';
import { withReduxStateSync } from 'redux-state-sync';
// npm i --save-dev @types/redux-state-sync
import { combineReducers } from 'redux';
import previewReducer from './preview/previewSlice';
import userReducer from './user/userSlice';


// Define rootReducer by combining reducers from all slices
const rootReducer = combineReducers({
  user: userReducer,
  preview: previewReducer,  
});

// Define RootState as the type of the combined state
export type RootState = ReturnType<typeof rootReducer>;
export default  withReduxStateSync(rootReducer);
