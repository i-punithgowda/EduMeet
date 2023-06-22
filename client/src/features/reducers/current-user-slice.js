import { createSlice } from "@reduxjs/toolkit";

export const UserStore = createSlice({
  name: "email",
  initialState: "",
  reducers: {
    currentUserModifier: (state, action) => {
      const authenticator = {
        text: action.payload,
      };

      return [authenticator];
    },
  },
});

// this is for dispatch
export const { currentUserModifier } = UserStore.actions;

// this is for configureStore
export default UserStore.reducer;
