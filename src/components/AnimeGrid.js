import {Button, Col, Container, Form, Modal, Row} from "react-bootstrap";
import React, {useState, useEffect} from 'react';
import './AnimeGrid.css'
import {BASE_URL} from "../global/network";
import {BsStar, BsStarFill} from "react-icons/bs";
import {AiOutlineEdit} from "react-icons/ai";
import {MAX_RATING} from "../global/anime_record";
import {sleep} from "../global/utils";


/*
  Handle the anime detail modal for updating anime info and rating
 */
function AnimeDetailModal(props) {
  // fixme Every time the form is changed, this function will be called.
  // The form is based on the modal data, which is defined in the parent component.

  const [showLoading, setShowLoading] = useState(false);
  const [isBangumiIdEditable, setIsBangumiIdEditable] = useState(false);

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
    const userId = 2;
    setShowLoading(true);

    const requestData = {
      animeId: props.animeId,
      // convert props.bangumiId to int if it is string, otherwise stay the same
      bangumiId: typeof props.bangumiId === 'string' ? parseInt(props.bangumiId) : props.bangumiId,
      animeRating: parseInt(props.animeRating),
    }
    // console.log(requestData)
    fetch(`${BASE_URL}/api/anime_record/${userId}/updateRecord`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)})
      .then(res => res.json())
      .then(data => {
        setShowLoading(false);
        props.onHide();
        // todo only refresh the page when the update is successful and some data is changed
        sleep(500).then(r => {
          window.location.reload();
        });
      })
      .catch(err => {
        console.log(err);
        setShowLoading(false);
        props.onHide();
        // todo use a better way to show error message
        alert("Fail to update the anime record");
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
          对图像和名称有疑问？
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        scrollable="true">
        <Form>
          <Form.Group as={Row} className="mb-3" controlId="animeName">
            <Form.Label column sm="2">动画名称</Form.Label>
            <Col sm="10">
              <Form.Control plaintext readOnly defaultValue={props.animeName} className="modal__anime-name"/>
            </Col>
          </Form.Group>

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
              <AiOutlineEdit size="1.2em" onClick={() => setIsBangumiIdEditable(prevState => !prevState)} className="modal__edit-button" />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="animeRating">
            <Form.Label column sm="2">评价</Form.Label>
            <Col sm="9">
              <Form.Select
                value={props.animeRating}
                onChange={handleChange}
                name="animeRating"
                aria-label="animeRatingSelect">
                <option>选择评价</option>
                <option value="1">非常一般   ★</option>
                <option value="2">有点意思   ★★</option>
                <option value="3">好看   ★★★</option>
                <option value="4">神作   ★★★★</option>
              </Form.Select>
            </Col>
          </Form.Group>

          <div className="m-auto pt-3 align-items-center d-flex flex-column">
            <Button variant="outline-primary" className="w-50" disabled={showLoading} onClick={() => handleSubmitClicked()}>
              {showLoading ? '请稍等...' : '更新'}
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

  function handleCardCLicked() {
    props.setAnimeDetail({
      animeId: props.id,
      animeName: props.name,
      bangumiId: props.bangumi_id,
      animeRating: props.rating,
    })
    props.showAnimeDetailModal(true)
  }

  return (
    <div className="anime-card" onClick={handleCardCLicked}>
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
    </div>
  )
}

function AnimeGrid(props) {

  // todo 数据缓存到自己的服务器 已有数据的就不请求了

  const [animeData, setAnimeData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [modalData, setModalData] = useState({
    animeId: 0,
    animeName: '',
    bangumiId: -1,
    animeRating: 0,
  });

  const userId = 2;

  useEffect(() => {
    if (props.searchText !== '') {
      console.log('searching...')
      fetch(`http://127.0.0.1:8080/api/anime_record/${userId}/search?searchText=${props.searchText}`)
        .then(res => res.json())
        .then(data => {
          data = data.data
          setAnimeData(prevAnimeData => {
            return [...data];
          });
        })
        .catch(err => {
          console.log(err);
        })
    }
  }, [props.searchText])

  useEffect(() => {
    if (props.rating === 0) {
      fetch(`${BASE_URL}/api/anime_record/${userId}`)
        .then(res => res.json())
        .then(data => {
          data = data.data;
          setAnimeData(prevAnimeData => {
            return [...data];
          });
        })
        .catch(err => {
          console.log(err);
        })
    } else if (props.rating > 0 || props.rating === -1) {
      fetch(`${BASE_URL}/api/anime_record/${userId}/rating/${props.rating}`)
        .then(res => res.json())
        .then(data => {
          data = data.data;
          setAnimeData(prevAnimeData => {
            return [...data];
          });
        })
        .catch(err => {
          console.log(err);
        })
    }

  }, [props.rating]);

  const animeCards = animeData.map((anime) => {
    return (
      <Col key={anime.id} className="pt-2 pb-2">
        <AnimeCard {...anime} setAnimeDetail={setModalData} showAnimeDetailModal={setModalShow}/>
      </Col>
    )
  })

  function handleLoadMoreClicked() {
    // todo 全部加载完之后出现提示并且按钮不可点击也不再请求
    const offset = animeData.length;
    if (props.searchText !== '') {
      fetch(`http://127.0.0.1:8080/api/anime_record/${userId}/search?offset=${offset}&searchText=${props.searchText}`)
        .then(res => res.json())
        .then(data => {
          data = data.data
          setAnimeData(prevAnimeData => {
            return [...prevAnimeData, ...data];
          });
        })
        .catch(err => {
          console.log(err);
        })
    } else if (props.rating === 0) {
      fetch(`${BASE_URL}/api/anime_record/${userId}?offset=${offset}`)
        .then(res => res.json())
        .then(data => {
          data = data.data;
          setAnimeData(prevAnimeData => {
            return [...prevAnimeData, ...data];
          });
        })
        .catch(err => {
          console.log(err);
        })
    } else if (props.rating > 0 || props.rating === -1) {
      fetch(`${BASE_URL}/api/anime_record/${userId}/rating/${props.rating}?offset=${offset}`)
        .then(res => res.json())
        .then(data => {
          data = data.data;
          setAnimeData(prevAnimeData => {
            return [...prevAnimeData, ...data];
          });
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
          <Row sm={2} md={3} lg={4} xs={1} className="pe-3">
            {animeCards}
          </Row>
        </Container>
        <Button variant="outline-primary" className="button__load-more" onClick={handleLoadMoreClicked}>Load More...</Button>
      </Container>
      <AnimeDetailModal {...modalData} show={modalShow} onHide={() => setModalShow(false)} setModalData={setModalData}/>
    </>
  );
}

export default AnimeGrid;