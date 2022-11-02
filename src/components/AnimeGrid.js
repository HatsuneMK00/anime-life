import {Col, Container, Row} from "react-bootstrap";
import React, {useState, useEffect} from 'react';
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

  // todo 数据缓存到自己的服务器 已有数据的就不请求了

  const [animeData, setAnimeData] = useState([]);

  useEffect(() => {
    const animeList = [
      280516,
      331535
    ]
    const animeListWithOrder = new Map();
    animeList.forEach((id, index) => {
      animeListWithOrder.set(id, index);
    })

    animeList.forEach((id) => {
      fetch(`https://api.bgm.tv/v0/subjects/${id}`)
        .then(res => res.json())
        .then(data => {
          setAnimeData(prevAnimeData => {
            const newAnimeData = [];
            if (prevAnimeData.length === 0) {
              const anime = {
                id: data.id,
                cover: data.images.large,
                name: data.name_cn,
                name_jp: data.name,
                rate: 3
              }
              newAnimeData.push(anime)
              return newAnimeData
            }
            let i = 0;
            for (; i < prevAnimeData.length; i++) {
              if (animeListWithOrder.get(prevAnimeData[i].id) < animeListWithOrder.get(data.id)) {
                newAnimeData.push(prevAnimeData[i])
              } else {
                const anime = {
                  id: data.id,
                  cover: data.images.large,
                  name: data.name_cn,
                  name_jp: data.name,
                  rate: 3
                }
                newAnimeData.push(anime)
                break
              }
            }
            for (; i < prevAnimeData.length; i++) {
              newAnimeData.push(prevAnimeData[i])
            }
            return newAnimeData
          });
        })
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