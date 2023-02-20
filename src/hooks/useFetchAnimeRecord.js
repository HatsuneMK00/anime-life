import React, {useEffect, useState} from 'react';
import {BASE_URL, GET} from "../global/network";
import {useDispatch} from "react-redux";
import {appendToTrailingMulti} from "../store/animeRecordDataSlice";

function UseFetchAnimeRecord(rating, offset, searchText) {
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    console.log("fetching data")
    setLoading(true)
    if (rating === 0) {
      GET(`${BASE_URL}/api/anime_record?offset=${offset}`)
        .then(data => {
          if (data.hasMore !== null) setHasMore(data.hasMore)
          data = data.data;
          dispatch(appendToTrailingMulti(data))
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          setLoading(false)
        })
    } else if (rating > 0 || rating === -1) {
      GET(`${BASE_URL}/api/anime_record/rating/${rating}?offset=${offset}`)
        .then(data => {
          if (data.hasMore !== null) setHasMore(data.hasMore)
          data = data.data;
          dispatch(appendToTrailingMulti(data))
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [rating, offset])

  return { loading, hasMore }
}

export default UseFetchAnimeRecord;
