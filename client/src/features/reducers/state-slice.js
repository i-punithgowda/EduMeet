import { createSlice } from "@reduxjs/toolkit";

export const StateModification = createSlice({
  name: "state",
  initialState: {
    currState: "stream",
  },
  reducers: {
    stateModifier: (state, action) => {
      console.log(action.payload);
      state.value = action.payload;
    },
  },
});

// this is for dispatch
export const { stateModifier } = StateModification.actions;

// this is for configureStore
export default StateModification.reducer;
