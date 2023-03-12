/*
  Handle the anime detail modal for updating anime info and rating
 */
import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {BASE_URL, GET, POST} from "../global/network";
import {deleteById, updateById} from "../store/animeRecordDataSlice";
import {setShowPopupAlert} from "../store/globalStatus";
import {decrementRating, incrementRating} from "../store/animeRecordSummarySlice";
import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import {AiOutlineEdit} from "react-icons/ai";
import {BsArrowLeftCircle, BsArrowRightCircle} from "react-icons/bs";
import './AnimeDetailModal.css'

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

  const oldRating = props.animeRating

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
        if (oldRating !== animeRecord.rating) {
          dispatch(decrementRating(oldRating))
          dispatch(incrementRating(animeRecord.rating))
        }
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

export default AnimeDetailModal