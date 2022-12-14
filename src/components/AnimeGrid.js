import {Button, Col, Container, Form, Modal, Row} from "react-bootstrap";
import React, {useEffect, useState} from 'react';
import './AnimeGrid.css'
import {BASE_URL, GET, POST} from "../global/network";
import {BsArrowLeftCircle, BsArrowRightCircle, BsStar, BsStarFill} from "react-icons/bs";
import {AiOutlineEdit} from "react-icons/ai";
import {MAX_RATING} from "../global/anime_record";
import {appendToTrailingMulti, deleteById, setRecordState, updateById} from "../store/animeRecordDataSlice";
import {useDispatch, useSelector} from "react-redux";
import {decrementRating} from "../store/animeRecordSummarySlice";
import {setShowPopupAlert} from "../store/globalStatus";


/*
  Handle the anime detail modal for updating anime info and rating
 */
function AnimeDetailModal(props) {
  // fixme Every time the form is changed, this function will be called.
  // The form is based on the modal data, which is defined in the parent component.

  const [showLoading, setShowLoading] = useState(false);
  const [showDeleteLoading, setShowDeleteLoading] = useState(false);
  const [isBangumiIdEditable, setIsBangumiIdEditable] = useState(false);
  const [hasHistoryRating, setHasHistoryRating] = useState(false);

  const dispatch = useDispatch();

  // fetch history rating if watch count larger than 1
  const [historyRating, setHistoryRating] = useState([]);
  const [historyRatingIdx, setHistoryRatingIdx] = useState(0);
  useEffect(() => {
    setHasHistoryRating(false);
    setHistoryRatingIdx(0);
    if (props.watchCount >= 2) {
      GET(`${BASE_URL}/api/anime_record/history_rating?animeId=${props.animeId}`)
        .then(data => {
          setHasHistoryRating(true);
          setHistoryRating(data.data);
        })
        .catch(error => {
          setHasHistoryRating(false);
          console.log(error);
        })
    }
  }, [props.animeId])

  function handleChange(e) {
    const {name, value} = e.target
    props.setModalData(prevModalData => {
      return {
        ...prevModalData,
        [name]: value,
      }
    });
  }

  // update the anime record
  function handleSubmitClicked() {
    setShowLoading(true);

    const requestData = {
      animeId: props.animeId,
      // convert props.bangumiId to int if it is string, otherwise stay the same
      bangumiId: typeof props.bangumiId === 'string' ? parseInt(props.bangumiId) : props.bangumiId,
      animeRating: parseInt(props.animeRating),
      comment: props.comment
    }
    console.log(requestData)
    // console.log(requestData)
    POST(`${BASE_URL}/api/anime_record/updateRecord`, requestData)
      .then(data => {
        setShowLoading(false);
        props.onHide();
        const anime = data.data.updated_anime
        const record = data.data.record
        const animeRecord = {
          id: record.anime_id,
          record_at: record.updated_at > record.created_at ? record.updated_at : record.created_at,
          rating: record.rating,
          comment: record.comment,
          bangumi_id: anime.bangumi_id,
          name: anime.name,
          name_jp: anime.name_jp,
          cover: anime.cover,
          watch_count: record.watch_count,
        }
        console.log(animeRecord)
        dispatch(updateById(animeRecord));
        dispatch(setShowPopupAlert({
          show: true,
          variant: 'success',
          message: '更新动画记录成功',
        }));
        setTimeout(() => {
          dispatch(setShowPopupAlert({
            show: false,
          }));
        }, 2000)
      })
      .catch(err => {
        console.log(err);
        setShowLoading(false);
        props.onHide();
        dispatch(setShowPopupAlert({
          show: true,
          variant: 'danger',
          message: '更新动画记录失败',
        }));
        setTimeout(() => {
          dispatch(setShowPopupAlert({
            show: false,
          }));
        }, 2000)
      })
  }

  function handleDeleteClicked() {
    setShowDeleteLoading(true);
    const requestData = {
      animeId: props.animeId,
    }
    POST(`${BASE_URL}/api/anime_record/deleteRecord`, requestData)
      .then(data => {
        setShowDeleteLoading(false);
        props.onHide();
        dispatch(deleteById(props.animeId));
        dispatch(decrementRating(props.animeRating));
        dispatch(setShowPopupAlert({
          show: true,
          variant: 'success',
          message: '删除动画记录成功',
        }));
        setTimeout(() => {
          dispatch(setShowPopupAlert({
            show: false,
          }));
        }, 2000)
      })
      .catch(err => {
        console.log(err);
        setShowDeleteLoading(false);
        props.onHide();
        dispatch(setShowPopupAlert({
          show: true,
          variant: 'danger',
          message: '删除动画记录失败',
        }));
        setTimeout(() => {
          dispatch(setShowPopupAlert({
            show: false,
          }));
        }, 2000)
      })
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.animeName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        scrollable="true">
        <Form>
          <Form.Group as={Row} className="mb-3" controlId="animeName">
            <Form.Label column sm="2">Bangumi ID</Form.Label>
            <Col sm="9">
              <Form.Control
                value={props.bangumiId}
                onChange={handleChange}
                disabled={!isBangumiIdEditable}
                name="bangumiId"/>
            </Col>
            <Col sm="1" className="d-flex flex-column align-items-center justify-content-center">
              <AiOutlineEdit size="1.2em" onClick={() => setIsBangumiIdEditable(prevState => !prevState)}
                             className="modal__edit-button"/>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="animeRating">
            <Form.Label column sm="2">评价</Form.Label>
            <Col sm="9">
              <Form.Select
                value={historyRatingIdx === 0 ? props.animeRating : historyRating[historyRatingIdx - 1].rating}
                onChange={handleChange}
                name="animeRating"
                disabled={historyRatingIdx !== 0}
                aria-label="animeRatingSelect">
                <option>选择评价</option>
                <option value="1">非常一般 ★</option>
                <option value="2">有点意思 ★★</option>
                <option value="3">好看 ★★★</option>
                <option value="4">神作 ★★★★</option>
              </Form.Select>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="comment">
            <Form.Label column sm="2">评论一下</Form.Label>
            <Col sm="9">
              <Form.Control
                as="textarea"
                value={historyRatingIdx === 0 ? props.comment : historyRating[historyRatingIdx - 1].comment}
                onChange={handleChange}
                name="comment"
                disabled={historyRatingIdx !== 0}
                rows={3}/>
            </Col>
          </Form.Group>

          {props.watchCount >= 2 &&
            <div className="history-rating-switcher">
              <BsArrowLeftCircle
                style={{
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setHistoryRatingIdx(prevState => {
                    if (prevState === 0) {
                      return 0;
                    } else {
                      return prevState - 1;
                    }
                  })
                }}/>
              <div style={{
                fontSize: '0.7em',
                marginLeft: '0.5em',
                marginRight: '0.5em',
                width: '10%',
                textAlign: 'center',
              }}>
                {historyRatingIdx + 1} / {historyRating.length + 1}
              </div>
              <BsArrowRightCircle
                style={{
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setHistoryRatingIdx(prevState => {
                    if (prevState === historyRating.length) {
                      return prevState
                    }
                    return prevState + 1
                  })
                }}/>
            </div>
          }

          <div className="m-auto pt-3 align-items-center d-flex flex-column">
            <Button variant="outline-primary" className="w-50" disabled={showLoading}
                    onClick={() => handleSubmitClicked()}>
              {showLoading ? '请稍等...' : '更新'}
            </Button>
          </div>

          <div className="m-auto pt-3 align-items-center d-flex flex-column">
            <Button variant="outline-danger" className="w-50" disabled={showDeleteLoading}
                    onClick={() => handleDeleteClicked()}>
              {showDeleteLoading ? '正在删除' : '删除该记录'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

function AnimeCard(props) {
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

  return (
    <div className="anime-card" onClick={handleCardClicked}>
      <img src={props.cover} alt="Cover" className="anime-card__cover"/>
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

  }, [props.rating]);

  const animeCards = animeRecordData.map((anime) => {
    return (
      <Col key={anime.id} className="pt-2 pb-2">
        <AnimeCard {...anime} setAnimeDetail={setModalData} showAnimeDetailModal={setModalShow}/>
      </Col>
    )
  })

  function handleLoadMoreClicked() {
    // todo 全部加载完之后出现提示并且按钮不可点击也不再请求
    const offset = animeRecordData.length;
    if (searchText !== '') {
      GET(`${BASE_URL}/api/anime_record/search?offset=${offset}&searchText=${searchText}`)
        .then(data => {
          data = data.data;
          dispatch(appendToTrailingMulti(data));
        })
        .catch(err => {
          console.log(err);
        })
    } else if (props.rating === 0) {
      GET(`${BASE_URL}/api/anime_record?offset=${offset}`)
        .then(data => {
          data = data.data;
          dispatch(appendToTrailingMulti(data));
        })
        .catch(err => {
          console.log(err);
        })
    } else if (props.rating > 0 || props.rating === -1) {
      GET(`${BASE_URL}/api/anime_record/rating/${props.rating}?offset=${offset}`)
        .then(data => {
          data = data.data;
          dispatch(appendToTrailingMulti(data));
        })
        .catch(err => {
          console.log(err);
        })
    }
  }

  return (
    <>
      <Container className="col-8 col-xl-10 col-md-9 p-0 me-0 anime-grid-container">
        <Container fluid className="pe-2">
          {/* 4 columns in a row on large screen, 3 columns in a row on a medium screen and 2 columns in a row on a small screen */}
          <Row sm={2} md={3} lg={4} xs={1} xl={5} xxl={5} className="pe-3">
            {animeCards}
          </Row>
        </Container>
        <Button variant="outline-primary" className="button__load-more" onClick={handleLoadMoreClicked}>Load
          More...</Button>
      </Container>
      <AnimeDetailModal {...modalData} show={modalShow} onHide={() => setModalShow(false)} setModalData={setModalData}/>
    </>
  );
}

export default AnimeGrid;