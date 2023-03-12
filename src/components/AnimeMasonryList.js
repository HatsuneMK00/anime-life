import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import useMedia from "../hooks/useMedia";
import useMeasure from "react-use-measure";
import {useTransition, a} from "@react-spring/web";
import './AnimeMasonryList.css'
import useFetchAnimeRecord from "../hooks/useFetchAnimeRecord";
import {useDispatch, useSelector} from "react-redux";
import AnimeCard from "./AniimeCard";
import AnimeDetailModal from "./AnimeDetailModal";
import Loading from "./Loading";
import {setRecordState} from "../store/animeRecordDataSlice";

function AnimeMasonryList(props) {
  // console.log("re-render")
  const [showModal, setShowModal] = useState(false)
  const [modalData, setModalData] = useState({
    animeId: 0,
    animeName: '',
    bangumiId: -1,
    animeRating: 0,
    comment: '',
  })
  // Hook1: Tie media queries to the number of columns
  const columns = useMedia(['(min-width: 2500px)', '(min-width: 2000px)', '(min-width: 1500px)', '(min-width: 1000px)', '(min-width: 600px)'], [7, 6, 5, 4, 3], 2)
  // Hook2: Measure the width of the container element
  const [ref, { width }] = useMeasure()
  // Hook3: Fetch data
  const dispatch = useDispatch()
  const animeRecordData = useSelector((state) => state.animeRecordData.value)
  const searchQuery = useSelector((state) => state.searchQuery.value);
  const [offset, setOffset] = useState(0)
  const { loading, hasMore } = useFetchAnimeRecord(props.rating, offset, searchQuery)
  // Hook4: Clear data and offset when rating or searchText change, instead of clear data after next fetch finished
  // Hook4.1: Get list ref to scroll to top
  const listRef = useRef()
  useEffect(() => {
    // console.log("rating changed, clear data")
    dispatch(setRecordState([]))
    if (listRef.current) listRef.current.scrollTo({top: 0})
    // setOffset(0)
  }, [props.rating, searchQuery])
  // Hook5: ref last card to load more
  const observer = useRef()
  const lastCardRef = useCallback(node => {
    // console.log("lastCardRef callback called")
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        // console.log("interacting")
        setOffset(animeRecordData.length)
      }
    })
    if (node) observer.current.observe(node)
  // fixme: maybe hasMore is implicitly included by change of animeRecordData. Same 6 renders with/without hasMore.
  }, [loading, animeRecordData, hasMore])
  // Hook6: Form a grid of stacked items using width & columns we got from hooks 1 & 2
  const [heights, gridItems] = useMemo(() => {
    let heights = new Array(columns).fill(0)
    let gridItems = animeRecordData.map((item, index) => {
      const column = heights.indexOf(Math.min(...heights))
      const x = (width / columns) * column
      const y = (heights[column] += item.height / 2) - item.height / 2
      return { ...item, x, y, width: width / columns, height: item.height / 2, index: index}
    })
    return [heights, gridItems]
  }, [columns, animeRecordData, width])
  // Hook7: Turn the static grid values into animated transitions, any addition, removal or change will be animated
  const transitions = useTransition(gridItems, {
    key: (item) => item.id,
    from: ({ x, y, width, height}) => ({ x, y ,width, height, opacity: 0}),
    enter: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 1 }),
    update: ({ x, y, width, height }) => ({ x, y, width, height }),
    // leave: { height: 0, opacity: 0 },
    config: { mass: 5, tension: 500, friction: 100 },
    trail: 25,
  })
  // Render the grid
  return (
    <>
      <div ref={ref} className="list_mock" />
      <div ref={listRef} className="list">
        {transitions((style, item) => {
          if (item.index + 1 === gridItems.length) {
            return (
              <a.div className="card" style={style} ref={lastCardRef}>
                <AnimeCard {...item} />
              </a.div>
            )
          } else {
            return (
              <a.div className="card" style={style}>
                <AnimeCard {...item} setAnimeDetail={setModalData} showAnimeDetailModal={setShowModal} />
              </a.div>
            )
          }
        })}
        { loading &&
          <div className="is_loading" style={{
            'transform': `translate3d(0px, ${Math.max(...heights)}px, 0px)`
          }}>
            <Loading />
          </div>
        }
        { !hasMore && !loading &&
          <div className="no_more" style={{
            'transform': `translate3d(0px, ${Math.max(...heights)}px, 0px)`
          }}>
            <span>没有更多啦</span>
          </div>
        }
      </div>
      <AnimeDetailModal {...modalData} show={showModal} onHide={() => setShowModal(false)} setModalData={setModalData} />
    </>
  );
}

export default AnimeMasonryList
