import React, {useEffect, useMemo, useState} from 'react';
import useMedia from "../hooks/useMedia";
import useMeasure from "react-use-measure";
import {useTransition, a} from "@react-spring/web";
import './AnimeMasonryList.css'
import useFetchAnimeRecord from "../hooks/useFetchAnimeRecord";
import {useDispatch, useSelector} from "react-redux";
import {setRecordState} from "../store/animeRecordDataSlice";
import AnimeCard from "./AniimeCard";

function AnimeMasonryList(props) {
  const padding = 15
  // Hook1: Tie media queries to the number of columns
  const columns = useMedia(['(min-width: 1500px)', '(min-width: 1000px)', '(min-width: 600px)'], [5, 4, 3], 2)
  // Hook2: Measure the width of the container element
  const [ref, { width }] = useMeasure()
  // Hook3: Fetch data
  const [offset, setOffset] = useState(0)
  const { loading, hasMore } = useFetchAnimeRecord(props.rating, offset, "")
  const animeRecordData = useSelector((state) => state.animeRecordData.value)
  const searchText = useSelector((state) => state.searchText.value);
  const dispatch = useDispatch();
  // Hook4: Clear data and offset when rating or searchText change
  useEffect(() => {
    console.log("rating changed, clear data and offset")
    dispatch(setRecordState([]))
    setOffset(0)
  }, [props.rating])

  // Hook5: Form a grid of stacked items using width & columns we got from hooks 1 & 2
  const [heights, gridItems] = useMemo(() => {
    let heights = new Array(columns).fill(0)
    let gridItems = animeRecordData.map((item, index) => {
      const column = heights.indexOf(Math.min(...heights))
      const x = (width / columns) * column
      const y = (heights[column] += item.height / 2) - item.height / 2 + padding
      return { ...item, x, y, width: width / columns, height: item.height / 2}
    })
    return [heights, gridItems]
  }, [columns, animeRecordData, width])
  // Hook6: Turn the static grid values into animated transitions, any addition, removal or change will be animated
  const transitions = useTransition(gridItems, {
    key: (item) => item.id,
    from: ({ x, y, width, height}) => ({ x, y ,width, height, opacity: 0}),
    enter: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 1 }),
    update: ({ x, y, width, height }) => ({ x, y, width, height }),
    leave: { height: 0, opacity: 0 },
    config: { mass: 5, tension: 500, friction: 100 },
    trail: 25,
  })
  // Render the grid
  return (
    <>
      <div ref={ref} className="list">
        {transitions((style, item) => {
          return (
            <a.div className="card" style={style}>
              <AnimeCard {...item} />
            </a.div>
          )
        })}
      </div>
    </>
  );
}

export default AnimeMasonryList
