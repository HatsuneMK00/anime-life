import {createSlice} from "@reduxjs/toolkit";

export const animeRecordSummarySlice = createSlice({
  name: 'animeRecordSummary',
  initialState: {
    value: {
      all: 0,
      ratingOne: 0,
      ratingTwo: 0,
      ratingThree: 0,
      ratingFour: 0,
    },
  },
  reducers: {
    setSummaryState: (state, action) => {
      state.value = action.payload;
    },
    incrementRating: (state, action) => {
      const rating = action.payload;
      switch (rating) {
        case 1:
          state.value.ratingOne += 1;
          state.value.all += 1;
          break;
        case 2:
          state.value.ratingTwo += 1;
          state.value.all += 1;
          break;
        case 3:
          state.value.ratingThree += 1;
          state.value.all += 1;
          break;
        case 4:
          state.value.ratingFour += 1;
          state.value.all += 1;
          break;
        default:
          break;
      }
    },
    decrementRating: (state, action) => {
      const rating = action.payload;
      switch (rating) {
        case 1:
          state.value.ratingOne -= 1;
          state.value.all -= 1;
          break;
        case 2:
          state.value.ratingTwo -= 1;
          state.value.all -= 1;
          break;
        case 3:
          state.value.ratingThree -= 1;
          state.value.all -= 1;
          break;
        case 4:
          state.value.ratingFour -= 1;
          state.value.all -= 1;
          break;
        default:
          break;
      }
    },
  }
})

export const {
  setSummaryState,
  incrementRating,
  decrementRating,
} = animeRecordSummarySlice.actions;

export default animeRecordSummarySlice.reducer;
