import { configureStore } from "@reduxjs/toolkit";
import animeRecordDataReducer from "./animeRecordDataSlice";
import animeRecordSummaryReducer from "./animeRecordSummarySlice";
import searchTextReducer from "./searchTextSlice";

export default configureStore({
  reducer: {
    animeRecordData: animeRecordDataReducer,
    animeRecordSummary: animeRecordSummaryReducer,
    searchText: searchTextReducer,
  },
})