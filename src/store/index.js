import { configureStore } from "@reduxjs/toolkit";
import animeRecordDataReducer from "./animeRecordDataSlice";
import animeRecordSummaryReducer from "./animeRecordSummarySlice";
import searchTextReducer from "./searchTextSlice";
import globalStatusReducer from "./globalStatus";
import goSearchReducer from "./goSearchSlice"

export default configureStore({
  reducer: {
    animeRecordData: animeRecordDataReducer,
    animeRecordSummary: animeRecordSummaryReducer,
    searchText: searchTextReducer,
    globalStatus: globalStatusReducer,
    goSearch: goSearchReducer,
  },
})