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
      state.value = action.payload.map(data => {
          return {
            id: data.id,
            record_at: data.modify_at > data.record_at ? data.modify_at : data.record_at,
            rating: data.rating,
            comment: data.comment,
            bangumi_id: data.bangumi_id,
            cover: data.cover,
            name: data.name,
            name_jp: data.name_jp,
            watch_count: data.watch_count,
          }
        }
      );
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

export const {
  appendToLeading,
  appendToTrailingMulti,
  setRecordState,
  deleteById,
  updateById
} = animeRecordDataSlice.actions;

export default animeRecordDataSlice.reducer;