import {Button, Form, Modal} from "react-bootstrap";
import './AddAnimeRecordModal.css'
import {useState} from "react";

function AddAnimeRecordModal(props) {

  function handleSubmitClicked() {
    props.onHide()
    console.log(formData)
    setFormData({
      animeName: '',
      animeRating: -2,
    })
  }

  const [formData, setFormData] = useState({
    animeName: '',
    animeRating: -2,
  });

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
      centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          记录动画
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        scrollable={true}>
        <Form>
          <Form.Group className="mb-3" controlId="animeName">
            <Form.Label>动画名称</Form.Label>
            <Form.Control
              value={formData.animeName}
              onChange={handleChange}
              name="animeName"
              type="text"
              placeholder="请输入动画名称"/>
            <Form.Text className="text-muted">
              建议使用与bangumi相同的名称 以获取正确的相关信息
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="animeRating">
            <Form.Label>评价</Form.Label>
            <Form.Select
              value={formData.animeRating}
              onChange={handleChange}
              name="animeRating"
              aria-label="animeRatingSelect">
              <option>选择评价</option>
              <option value="1">非常一般   ★</option>
              <option value="2">有点意思   ★★</option>
              <option value="3">好看   ★★★</option>
              <option value="4">神作   ★★★★</option>
            </Form.Select>
          </Form.Group>

          <div className="m-auto pt-3 align-items-center d-flex flex-column">
            <Button variant="outline-primary" className="w-50" onClick={() => handleSubmitClicked()}>提交</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddAnimeRecordModal;