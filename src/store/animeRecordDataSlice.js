import {createSlice} from "@reduxjs/toolkit";

export const animeRecordDataSlice = createSlice({
  name: 'animeRecordData',
  initialState: {
    value: [],
  },
  reducers: {
    appendToLeading: (state, action) => {
      const newData = {
        ...action.payload,
        height: 800
      }
      state.value = [newData, ...state.value];
    },
    appendToTrailingMulti: (state, action) => {
      const newData = action.payload.map(data => {
        return {
          ...data,
          record_at: data.modify_at > data.record_at ? data.modify_at : data.record_at,
          height: 800,
        }
      })
      state.value = [...state.value, ...newData];
    },
    setRecordState: (state, action) => {
      state.value = action.payload.map(data => {
          return {
            ...data,
            record_at: data.modify_at > data.record_at ? data.modify_at : data.record_at,
            height: 800,
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