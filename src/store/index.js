import { configureStore } from "@reduxjs/toolkit";
import animeRecordDataReducer from "./animeRecordDataSlice";
import animeRecordSummaryReducer from "./animeRecordSummarySlice";
import searchQueryReducer from "./searchQuerySlice";
import globalStatusReducer from "./globalStatus";

export default configureStore({
  reducer: {
    animeRecordData: animeRecordDataReducer,
    animeRecordSummary: animeRecordSummaryReducer,
    searchQuery: searchQueryReducer,
    globalStatus: globalStatusReducer,
  },
})