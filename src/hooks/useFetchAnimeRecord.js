import React, {useEffect, useState} from 'react';
import {BASE_URL, GET} from "../global/network";
import {useDispatch, useSelector} from "react-redux";
import {appendToTrailingMulti, setRecordState} from "../store/animeRecordDataSlice";
import usePrevious from "./usePrevious";

function UseFetchAnimeRecord(rating, offset, goSearch) {
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const dispatch = useDispatch()
  const searchText = useSelector(state => state.searchText.value)

  const previousRating = usePrevious(rating)
  const previousGoSearch = usePrevious(goSearch)
  const previousOffset = usePrevious(offset)

  useEffect(() => {
    console.log("fetching data")
    if (rating !== previousRating) {
      console.log("rating changed")
    }
    if (goSearch !== previousGoSearch) {
      console.log("search status changed")
    }
    if (previousOffset !== offset) {
      console.log("offset changed")
    }

    // when rating changed, only update rating related, offset is not used.
    // when searching, rating is set to -2, the only case that rating may change together with goSearch
    if (rating !== previousRating && rating !== -2) {
      if (rating === 0) {
        setLoading(true)
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
        setLoading(true)
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
    // when search request fires
    } else if (goSearch !== previousGoSearch && searchText && searchText !== '') {
      setLoading(true)
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
    } else if (offset !== previousOffset) {
      if (searchText && searchText !== '') {
        setLoading(true)
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
        setLoading(true)
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
        setLoading(true)
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
  }, [rating, goSearch, offset])

  return { loading, hasMore }
}

export default UseFetchAnimeRecord;
