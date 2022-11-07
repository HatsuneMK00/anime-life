import {Col, Container, Row} from "react-bootstrap";
import React, {useState, useEffect} from 'react';
import './AnimeGrid.css'
import {BASE_URL} from "../global/network";
import {BsStar, BsStarFill} from "react-icons/bs";
import {MAX_RATING} from "../global/anime_record";

function AnimeCard(props) {
  function RatingRow(props) {
    const ratingDiv = []
    for (let i = 0; i < MAX_RATING; i++) {
      if (i < props.rating) {
        ratingDiv.push(
          <BsStarFill className="anime-card__rating__star"/>
        )
      } else {
        ratingDiv.push(
          <BsStar className="anime-card__rating__star"/>
        )
      }
    }
    return (
      <div className="anime-card__rating">
        {ratingDiv}
      </div>
    )
  }

  return (
    <div className="anime-card">
      <img src={props.cover} alt="Cover" className="anime-card__cover"/>
      <div className="anime-card__info">
        <div className="anime-card__name">
          {props.name}
        </div>
        <div className="anime-card__name-jp">
          {props.name_jp}
        </div>
        <div>
          {props.record_at.substring(0, props.record_at.indexOf('T'))}
        </div>
        <RatingRow rating={props.rating}/>
      </div>
    </div>
  )
}

function AnimeGrid(props) {

  // todo 数据缓存到自己的服务器 已有数据的就不请求了

  const [animeData, setAnimeData] = useState([]);

  const userId = 2;
  const offset = 0;
  useEffect(() => {
    fetch(`${BASE_URL}/api/anime_record/${userId}?offset=${offset}`)
      .then(res => res.json())
      .then(data => {
        data = data.data;
        console.log(data);
        setAnimeData(prevAnimeData => {
          return [...prevAnimeData, ...data];
        });
      })
      .catch(err => {
        console.log(err);
      })
  }, []);

  const animeCards = animeData.map((anime) => {
    return (
      <Col key={anime.id} className="pt-2 pb-2">
        <AnimeCard {...anime}/>
      </Col>
    )
  })

  return (
    <Container className="col-8 col-xl-10 col-md-9 p-0 me-0 anime-grid-container">
      <Container fluid className="pe-2">
        {/* 4 columns in a row on large screen, 3 columns in a row on a medium screen and 2 columns in a row on a small screen */}
        <Row sm={2} md={3} lg={4} xs={1} className="pe-3">
          {animeCards}
        </Row>
      </Container>
    </Container>
  );
}

export default AnimeGrid;