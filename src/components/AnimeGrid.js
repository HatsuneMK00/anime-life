import {Col, Container, Row} from "react-bootstrap";
import React, {useCallback, useEffect, useRef, useState} from 'react';
import './AnimeGrid.css'
import {BASE_URL, GET} from "../global/network";
import {appendToTrailingMulti, setRecordState} from "../store/animeRecordDataSlice";
import {useDispatch, useSelector} from "react-redux";
import AnimeDetailModal from "./AnimeDetailModal";
import AnimeCard from "./AniimeCard";


function AnimeGrid(props) {

  // todo 数据缓存到自己的服务器 已有数据的就不请求了

  const [modalShow, setModalShow] = useState(false);
  const [modalData, setModalData] = useState({
    animeId: 0,
    animeName: '',
    bangumiId: -1,
    animeRating: 0,
    comment: '',
  });
  const animeRecordData = useSelector((state) => state.animeRecordData.value);
  const searchText = useSelector((state) => state.searchText.value);
  const dispatch = useDispatch();

  const animeGridRef = useRef();

  useEffect(() => {
    if (props.rating === 0) {
      GET(`${BASE_URL}/api/anime_record`)
        .then(data => {
          data = data.data;
          dispatch(setRecordState(data));
        })
        .catch(err => {
          console.log(err);
        })
    } else if (props.rating > 0 || props.rating === -1) {
      GET(`${BASE_URL}/api/anime_record/rating/${props.rating}`)
        .then(data => {
          data = data.data;
          dispatch(setRecordState(data));
        })
        .catch(err => {
          console.log(err);
        })
    }
    setHasMore(true)
    animeGridRef.current.scrollTo({top: 0})
  }, [props.rating]);

  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const handleLoadMore = useCallback(() => {
    const offset = animeRecordData.length;
    if (searchText !== '') {
      GET(`${BASE_URL}/api/anime_record/search?offset=${offset}&searchText=${searchText}`)
        .then(data => {
          data = data.data;
          if (data.length === 0) setHasMore(false)
          setLoading(false)
          dispatch(appendToTrailingMulti(data));
        })
        .catch(err => {
          console.log(err);
        })
    } else if (props.rating === 0) {
      GET(`${BASE_URL}/api/anime_record?offset=${offset}`)
        .then(data => {
          data = data.data;
          if (data.length === 0) setHasMore(false)
          setLoading(false)
          dispatch(appendToTrailingMulti(data));
        })
        .catch(err => {
          console.log(err);
        })
    } else if (props.rating > 0 || props.rating === -1) {
      GET(`${BASE_URL}/api/anime_record/rating/${props.rating}?offset=${offset}`)
        .then(data => {
          data = data.data;
          if (data.length === 0) setHasMore(false)
          setLoading(false)
          dispatch(appendToTrailingMulti(data));
        })
        .catch(err => {
          console.log(err);
        })
    }
  }, [animeRecordData, props.rating, searchText])

  const observer = useRef()
  const lastCardRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setLoading(true)
        handleLoadMore()
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore, handleLoadMore])

  const animeCards = animeRecordData.map((anime, index) => {
      if (animeRecordData.length === index + 1) {
        return <div ref={lastCardRef} key={anime.id}>
          <Col className="pt-2 pb-2">
            <AnimeCard {...anime} setAnimeDetail={setModalData} showAnimeDetailModal={setModalShow}/>
          </Col>
        </div>
      } else {
        return <div key={anime.id}>
          <Col className="pt-2 pb-2">
            <AnimeCard {...anime} setAnimeDetail={setModalData} showAnimeDetailModal={setModalShow}/>
          </Col>
        </div>
      }
  })

  return (
    <>
      <Container className="col-8 col-xl-10 col-md-9 p-0 me-0 anime-grid-container" ref={animeGridRef}>
        <Container fluid className="pe-2">
          {/* 4 columns in a row on large screen, 3 columns in a row on a medium screen and 2 columns in a row on a small screen */}
          <Row sm={2} md={3} lg={4} xs={1} xl={5} xxl={5} className="pe-3">
            {animeCards}
          </Row>
        </Container>
        <div>{loading && "Loading..."}</div>
        <div>{!hasMore && "That's All"}</div>
      </Container>
      <AnimeDetailModal {...modalData} show={modalShow} onHide={() => setModalShow(false)} setModalData={setModalData}/>
    </>
  );
}

export default AnimeGrid;