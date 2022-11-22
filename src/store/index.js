import { configureStore } from "@reduxjs/toolkit";
import animeRecordDataReducer from "./animeRecordDataSlice";
import animeRecordSummaryReducer from "./animeRecordSummarySlice";

export default configureStore({
  reducer: {
    animeRecordData: animeRecordDataReducer,
    animeRecordSummary: animeRecordSummaryReducer,
  },
})