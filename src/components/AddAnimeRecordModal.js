import {Button, Form, Modal} from "react-bootstrap";
import './AddAnimeRecordModal.css'
import {useState} from "react";
import {BASE_URL, POST} from "../global/network";
import {useDispatch, useSelector} from "react-redux";
import {appendToLeading, deleteById} from "../store/animeRecordDataSlice";
import {incrementRating} from "../store/animeRecordSummarySlice";
import {setShowPopupAlert} from "../store/globalStatus";
import LiveSearch from "./LiveSearch";

function AddAnimeRecordModal(props) {

  const currentAnimeRecords = useSelector(state => state.animeRecordData.value);
  const dispatch = useDispatch();

  function handleSubmitClicked() {
    setShowLoading(true);
    const requestData = {
      animeName: animeName,
      animeRating: parseInt(formData.animeRating),
      comment: formData.comment,
    }
    console.log(requestData);
    POST(`${BASE_URL}/api/anime_record/addRecord`, requestData)
      .then(data => {
        setShowLoading(false);
        props.onHide();
        console.log(data);
        const anime = data.data.anime
        const record = data.data.record
        const isNew = data.data.is_new
        const animeRecord = {
          id: record.anime_id,
          record_at: record.updated_at > record.created_at ? record.updated_at : record.created_at,
          rating: record.rating,
          comment: record.comment,
          bangumi_id: anime.bangumi_id,
          cover: anime.cover,
          name: anime.name,
          name_jp: anime.name_jp,
          watch_count: record.watch_count,
        }
        if (isNew) {
          dispatch(appendToLeading(animeRecord));
          dispatch(incrementRating(animeRecord.rating));
        } else {
          dispatch(deleteById(animeRecord.id));
          dispatch(appendToLeading(animeRecord));
        }
        dispatch(setShowPopupAlert({
          show: true,
          variant: 'success',
          message: '添加成功',
        }));
        setTimeout(() => {
          dispatch(setShowPopupAlert({
            show: false,
          }));
        }, 2000)
        // This log doesn't show the latest state of animeRecordData
        // console.log(animeRecordData);
      })
      .catch(err => {
        console.log(err);
        setShowLoading(false);
        props.onHide();
        dispatch(setShowPopupAlert({
          show: true,
          variant: 'danger',
          message: '添加动画记录失败',
        }));
        setTimeout(() => {
          dispatch(setShowPopupAlert({
            show: false,
          }));
        }, 2000)
      })
      .finally(() => {
        setFormData({
          animeName: '',
          animeRating: -2,
          comment: '',
        })
      })
  }

  const [formData, setFormData] = useState({
    animeRating: -2,
    comment: '',
  });

  const [animeName, setAnimeName] = useState('');
  const [showSearchResult, setShowSearchResult] = useState(false)

  const [showLoading, setShowLoading] = useState(false);

  function handleChange(e) {
    const {name, value} = e.target
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [name]: value,
      }
    });
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      onClick={event => {
        // If the click is not on the search result list, then hide the list
        // If the click is on the search result list, then do nothing
        if (event.target.id !== 'search-result__item') {
          setShowSearchResult(false)
        }
      }}
      centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          记录动画
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        scrollable="true">
        <Form>
          <Form.Group className="mb-3" controlId="animeName">
            <Form.Label>动画名称</Form.Label>
            <LiveSearch
              animeName={animeName}
              setAnimeName={setAnimeName}
              showSearchResult={showSearchResult}
              setShowSearchResult={setShowSearchResult}/>
          </Form.Group>

          <Form.Group className="mb-3" controlId="animeRating">
            <Form.Label>评价</Form.Label>
            <Form.Select
              value={formData.animeRating}
              onChange={handleChange}
              name="animeRating"
              aria-label="animeRatingSelect">
              <option>选择评价</option>
              <option value="1">非常一般 ★</option>
              <option value="2">有点意思 ★★</option>
              <option value="3">好看 ★★★</option>
              <option value="4">神作 ★★★★</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="comment">
            <Form.Label>评论一下</Form.Label>
            <Form.Control
              as={"textarea"}
              rows={3}
              value={formData.comment}
              onChange={handleChange}
              name="comment"
              type="text"
              placeholder="随便写点什么"/>
          </Form.Group>

            <div className="m-auto pt-3 align-items-center d-flex flex-column">
              <Button variant="outline-primary" className="w-50" disabled={showLoading}
                      onClick={() => handleSubmitClicked()}>
                {showLoading ? props.loadingmsg : '提交'}
              </Button>
            </div>
        </Form>
      </Modal.Body>
    </Modal>
);
}

export default AddAnimeRecordModal;