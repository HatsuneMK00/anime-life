import React, {useEffect, useState} from 'react';
import {BASE_URL, GET} from "../global/network";
import {useDispatch} from "react-redux";
import {appendToTrailingMulti, setRecordState} from "../store/animeRecordDataSlice";
import usePrevious from "./usePrevious";

function UseFetchAnimeRecord(rating, offset, searchText) {
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const dispatch = useDispatch()

  const previousRating = usePrevious(rating)
  const previousSearchText = usePrevious(searchText)

  useEffect(() => {
    console.log("fetching data")
    if (rating !== previousRating) {
      console.log("rating changed")
    }
    if (searchText !== previousSearchText) {
      console.log("searchText changed")
    }

    setLoading(true)
    // when rating changed, only update rating related, offset is not used
    if (rating !== previousRating) {
      if (rating === 0) {
        GET(`${BASE_URL}/api/anime_record`)
          .then(data => {
            if (data.hasMore !== null) setHasMore(data.hasMore)
            data = data.data
            dispatch(setRecordState(data))
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => {
            setLoading(false)
          })
      } else if (rating > 0 || rating === -1) {
        GET(`${BASE_URL}/api/anime_record/rating/${rating}`)
          .then(data => {
            if (data.hasMore !== null) setHasMore(data.hasMore)
            data = data.data
            dispatch(setRecordState(data))
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => {
            setLoading(false)
          })
      }
    // when searchText is changed, only fetch related data, offset is not used
    } else if (searchText !== previousSearchText) {
      GET(`${BASE_URL}/api/anime_record/search?searchText=${searchText}`)
        .then(data => {
          if (data.hasMore !== null) setHasMore(data.hasMore)
          data = data.data
          dispatch(setRecordState(data))
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          setLoading(false)
        })
    // offset changed, the other two won't change in this case, offset is set correctly by parent component
    } else {
      if (searchText && searchText !== '') {
        GET(`${BASE_URL}/api/anime_record/search?offset=${offset}&searchText=${searchText}`)
          .then(data => {
            if (data.hasMore !== null) setHasMore(data.hasMore)
            data = data.data
            dispatch(appendToTrailingMulti(data))
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => {
            setLoading(false)
          })
      } else if (rating === 0) {
        GET(`${BASE_URL}/api/anime_record?offset=${offset}`)
          .then(data => {
            if (data.hasMore !== null) setHasMore(data.hasMore)
            data = data.data
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
            data = data.data
            dispatch(appendToTrailingMulti(data))
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => {
            setLoading(false)
          })
      }
    }
  }, [rating, searchText, offset])

  return { loading, hasMore }
}

export default UseFetchAnimeRecord;
