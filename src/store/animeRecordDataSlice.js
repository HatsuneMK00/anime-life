import {createSlice} from "@reduxjs/toolkit";

export const animeRecordDataSlice = createSlice({
  name: 'animeRecordData',
  initialState: {
    value: [],
  },
  reducers: {
    appendToLeading: (state, action) => {
      state.value = [action.payload, ...state.value];
    },
    appendToTrailingMulti: (state, action) => {
      state.value = [...state.value, ...action.payload];
    },
    setRecordState: (state, action) => {
      state.value = action.payload;
    },
    deleteById: (state, action) => {
      const animeId = action.payload;
      state.value = state.value.filter(record => record.id !== animeId);
    },
    updateById: (state, action) => {
      // replace the old record with action.payload
      const newRecord = action.payload;
      state.value = state.value.map(record => {
        if (record.id === newRecord.id) {
          return newRecord;
        } else {
          return record;
        }
      })
    }
  }
})

export const {appendToLeading, appendToTrailingMulti, setRecordState, deleteById, updateById} = animeRecordDataSlice.actions;

export default animeRecordDataSlice.reducer;