import { configureStore } from "@reduxjs/toolkit";
import animeRecordDataReducer from "./animeRecordDataSlice";

export default configureStore({
  reducer: {
    animeRecordData: animeRecordDataReducer,
  },
})