import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "../reducers/auth-slice";
import StateReducer from "../reducers/state-slice";
import EmailReducer from "../reducers/current-user-slice";

export default configureStore({
  reducer: {
    auth: AuthReducer,
    currState: StateReducer,
    currEmail: EmailReducer,
  },
});
