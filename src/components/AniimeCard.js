import {MAX_RATING} from "../global/anime_record";
import {BsStar, BsStarFill} from "react-icons/bs";
import React, {useState} from "react";
import './AnimeCard.css'

function AnimeCard(props) {
  // if (props.index === 0) {
  //   console.log("the first anime card component is re-rendered")
  // }
  function RatingRow(props) {
    const ratingDiv = []
    for (let i = 0; i < MAX_RATING; i++) {
      if (i < props.rating) {
        ratingDiv.push(
          <BsStarFill key={i} className="anime-card__rating__star"/>
        )
      } else {
        ratingDiv.push(
          <BsStar key={i} className="anime-card__rating__star"/>
        )
      }
    }
    return (
      <div className="anime-card__rating">
        {ratingDiv}
      </div>
    )
  }

  function handleCardClicked() {
    props.setAnimeDetail({
      animeId: props.id,
      animeName: props.name,
      bangumiId: props.bangumi_id,
      animeRating: props.rating,
      comment: props.comment,
      watchCount: props.watch_count,
      recordAt: props.record_at,
    })
    props.showAnimeDetailModal(true)
  }

  const [loaded, setLoaded] = useState(false)

  return (
    <div className="anime-card" onClick={handleCardClicked}>
      <img src={props.cover} alt="Cover" onLoad={() => setLoaded(true)} className={ loaded ? "anime-card__cover" : "anime-card__cover anime-card__cover__skeleton"}/>
      <div className="anime-card__info">
        <div className="anime-card__name">
          {props.name}
        </div>
        <div className="anime-card__name-jp">
          {props.name_jp}
        </div>
        {
          props.record_at.substring(0, props.record_at.indexOf('T')) !== '0001-01-01' &&
          <div>
            {props.record_at.substring(0, props.record_at.indexOf('T'))}
          </div>
        }
        <RatingRow rating={props.rating}/>
      </div>
      {props.watch_count >= 2 &&
        <div className="anime-card__watch-count">
          {props.watch_count} 刷
        </div>
      }
    </div>
  )
}

export default AnimeCard