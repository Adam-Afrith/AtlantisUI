import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   gameId: null,
//   currentTab: 3,
//   currentSubTab: 0,
//   currentQuest: 1,
//   isDispatched: false,
//   activeBlockSeq: 1,
//   CompKeyCount: 0
// };
const initialState = {
  gameId: null,
  currentTab: 3,
  currentSubTab: 0,
  currentQuest: 1,
  isModified: false,
  activeBlockSeq: 1,
  CompKeyCount: 0,
  onFocusValue: null,
};
const reduxInitialState = null;
export const previewSlice = createSlice({
  name: 'preview',
  initialState: reduxInitialState,
  reducers: {
    updatePreviewData: (state, action) => {
      const payload = action?.payload;
      if (!payload || !payload.gameId) {
        return initialState;
        } 
        else{
        const gameId = payload?.gameId;
        if(gameId)
        {
          let newState  ={};
            if(state?.[gameId]){
              newState = {...state, [gameId]: {...state[gameId], ...payload}};
              }
              else{
                newState = {...state, [gameId]: {...initialState, ...payload}};
            }
          return newState;
        }
      }
    },
    createPreviewData:(state,action) =>
      {
        if((state!==undefined  &&  state !==null)){
          if(Object.keys(state).find(keyvalue => action.payload == keyvalue) )
          {
            return state;
          }
        }
          else{
            let newState ={} ;
            const gameId = action.payload;
            const newInitialState ={...initialState,gameId:gameId};
            if(state === null )
              {  
                newState = { [gameId]:newInitialState};
              }
              else{
                 newState = { ...state, [gameId]:newInitialState};
              }
            return newState;
           }          
    },
    removeGame: (state, action) =>{
        const gameId = action.payload;      
        if(gameId && Object.keys(state).some(id => id===gameId))
          {
            const newState = Object.keys(state).filter(id => id!==gameId);
            return newState;
          }
    },
    resetGameDispatchState: (state,action) =>{
        if(action?.payload)
          {
            const newState = {...state, [action.payload]:{...(state[action.payload]), isDispatched: false}};
            return newState;
          }
    },
    onFocusField: (state, action)=>{
        const payload= action?.payload;
        const newState = {...state, [payload.gameId]:{...state[payload.gameId], onFocusValue: payload ? payload.focusValue : '', isModified: false}};
        return newState;
    },
    /***can use this this reducer function - onBlurField, when able to handle Content changes on focus and blur use this function to handle it */
    onBlurField: (state, action)=>{
          //action.payload=> {gameId: number, blurValue: string}
          const payload = action?.payload;
        if(payload.gameId){
          if(state[payload.gameId]?.onFocusValue?.trim() !== payload?.blurValue?.trim())
            {
              const newState = {...state, [payload.gameId]:{ ...state[payload.gameId],onFocusValue: null, isModified:true}};
              return newState;
              }
              else{
                const newState = {...state, [payload.gameId]:{ ...state[payload.gameId], onFocusValue: null, isModified:false}};
              return newState;
            }
          }
    },
    resetGameModifiedState: (state,action) =>{
        //payload only has gameId
        if(action?.payload)
          {
            const newState = {...state, [action.payload]:{...(state[action.payload]), isModified: false}};
            return newState;
          }
    },
    /***When you have the logic if value is modified, then use this reducer function - onFieldContentModified */
    onFieldContentModified: (state, action)=>{
      //action.payload=> {gameId: number, blurValue: string}
      const payload = action?.payload;
    if(payload.gameId ){
          let newState = {...state, [payload.gameId]:{ ...state[payload.gameId],onFocusValue: null, isModified:true, }};

          if(payload.hasOwnProperty("modifiedField"))
            {
              /**Need to handle if modifiedField is an array */
              console.log("payload.updatedValue", payload.updatedValue)
              newState = {...newState, [payload.gameId] : {...newState[payload.gameId], modifiedField: payload?.modifiedField, updatedValue: payload.updatedValue || ''}};
            }
          return newState;  
      }
    },
  },
  extraReducers(builder) {},
});

export const { updatePreviewData,createPreviewData, removeGame, resetGameDispatchState, onFocusField, onBlurField, resetGameModifiedState, onFieldContentModified } = previewSlice.actions;

export default previewSlice.reducer;
