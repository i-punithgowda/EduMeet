import { createSlice } from "@reduxjs/toolkit";

export const Authentication = createSlice({
  name: "auth",
  initialState: [],
  reducers: {
    authModifier: (state, action) => {
      const authenticator = {
        text: action.payload || false,
      };

      return [authenticator];
    },
  },
});

// this is for dispatch
export const { authModifier } = Authentication.actions;

// this is for configureStore
export default Authentication.reducer;
