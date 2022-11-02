import {Col, Container, Row} from "react-bootstrap";
import React from 'react';
import './AnimeGrid.css'

function AnimeCard(props) {
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
        <div className="anime-card__rate">
          {props.rate}
        </div>
      </div>
    </div>
  )
}

function AnimeGrid() {
  const animes = [
    {
      id: 1,
      cover: "http://lain.bgm.tv/pic/cover/l/13/da/280516_TvEE7.jpg",
      name: "昨日之歌",
      name_jp: "イエスタデイをうたって",
      rate: 3,
    },
    {
      id: 2,
      cover: "http://lain.bgm.tv/pic/cover/l/13/da/280516_TvEE7.jpg",
      name: "昨日之歌",
      name_jp: "イエスタデイをうたって",
      rate: 3,
    },
    {
      id: 3,
      cover: "http://lain.bgm.tv/pic/cover/l/13/da/280516_TvEE7.jpg",
      name: "昨日之歌",
      name_jp: "イエスタデイをうたって",
      rate: 3,
    },
    {
      id: 4,
      cover: "http://lain.bgm.tv/pic/cover/l/13/da/280516_TvEE7.jpg",
      name: "昨日之歌",
      name_jp: "イエスタデイをうたって",
      rate: 3,
    },
    {
      id: 5,
      cover: "http://lain.bgm.tv/pic/cover/l/13/da/280516_TvEE7.jpg",
      name: "昨日之歌",
      name_jp: "イエスタデイをうたって",
      rate: 3,
    },
    {
      id: 6,
      cover: "http://lain.bgm.tv/pic/cover/l/13/da/280516_TvEE7.jpg",
      name: "昨日之歌",
      name_jp: "イエスタデイをうたって",
      rate: 3,
    },
    {
      id: 7,
      cover: "http://lain.bgm.tv/pic/cover/l/13/da/280516_TvEE7.jpg",
      name: "昨日之歌",
      name_jp: "イエスタデイをうたって",
      rate: 3,
    },
    {
      id: 8,
      cover: "http://lain.bgm.tv/pic/cover/l/13/da/280516_TvEE7.jpg",
      name: "昨日之歌",
      name_jp: "イエスタデイをうたって",
      rate: 3,
    },
    {
      id: 9,
      cover: "http://lain.bgm.tv/pic/cover/l/13/da/280516_TvEE7.jpg",
      name: "昨日之歌",
      name_jp: "イエスタデイをうたって",
      rate: 3,
    },
    {
      id: 10,
      cover: "http://lain.bgm.tv/pic/cover/l/13/da/280516_TvEE7.jpg",
      name: "昨日之歌",
      name_jp: "イエスタデイをうたって",
      rate: 3,
    },
    {
      id: 11,
      cover: "http://lain.bgm.tv/pic/cover/l/13/da/280516_TvEE7.jpg",
      name: "昨日之歌",
      name_jp: "イエスタデイをうたって",
      rate: 3,
    },
  ]

  const animeCards = animes.map((anime) => {
    return (
      <Col key={anime.id} className="pt-2 pb-2">
        <AnimeCard {...anime}/>
      </Col>
    )
  })

  return (
    <Container className="col-8 col-xl-10 col-md-9 p-0 me-0 anime-grid-container">
      <Container fluid>
        {/* 4 columns in a row on large screen, 3 columns in a row on a medium screen and 2 columns in a row on a small screen */}
        <Row sm={2} md={3} lg={4} xs={1}>
          {animeCards}
        </Row>
      </Container>
    </Container>
  );
}

export default AnimeGrid;