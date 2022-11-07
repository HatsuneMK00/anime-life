import {Button, Col, Row} from "react-bootstrap";
import './MySideBar.css';
import SideBarItem from "./SideBarItem";
import {GrAdd} from "react-icons/gr";
import {useEffect, useState} from "react";
import {BASE_URL} from "../global/network";

function MySideBar(props) {
  const userId = 2;

  const [sideBarData, setSideBarData] = useState({
    all: 0,
    ratingOne: 0,
    ratingTwo: 0,
    ratingThree: 0,
    ratingFour: 0,
  });

  useEffect(() => {
    fetch(`${BASE_URL}/api/anime_record/${userId}/summary`)
      .then(res => res.json())
      .then(data => {
        data = data.data;
        setSideBarData({
          all: data.total_count,
          ratingOne: data.rating_one_count,
          ratingTwo: data.rating_two_count,
          ratingThree: data.rating_three_count,
          ratingFour: data.rating_four_count,
        })
      })
  }, []);

  return (
    <div className="col-4 col-xl-2 col-md-3 d-flex flex-column ms-0 p-0 sidebar-container">
      <Row className={props.chosen === 0 ? "sidebar-row sidebar-row__selected" : "sidebar-row"}
           onClick={() => props.choose(0)}>
        <Col className="pe-0">
          <SideBarItem sideBarText="所有记录" recordCount={sideBarData.all}/>
        </Col>
      </Row>
      <Row
        className={props.chosen === 1 ? "sidebar-row sidebar-row__selected" : "sidebar-row"}
        onClick={() => props.choose(1)}>
        <Col className="pe-0">
          <SideBarItem sideBarText="非常一般" recordCount={sideBarData.ratingOne}/>
        </Col>
      </Row>
      <Row className={props.chosen === 2 ? "sidebar-row sidebar-row__selected" : "sidebar-row"}
           onClick={() => props.choose(2)}>
        <Col className="pe-0">
          <SideBarItem sideBarText="有点意思" recordCount={sideBarData.ratingTwo}/>
        </Col>
      </Row>
      <Row className={props.chosen === 3 ? "sidebar-row sidebar-row__selected" : "sidebar-row"}
           onClick={() => props.choose(3)}>
        <Col className="pe-0">
          <SideBarItem sideBarText="好看" recordCount={sideBarData.ratingThree}/>
        </Col>
      </Row>
      <Row className={props.chosen === 4 ? "sidebar-row sidebar-row__selected" : "sidebar-row"}
           onClick={() => props.choose(4)}>
        <Col className="pe-0">
          <SideBarItem sideBarText="神作" recordCount={sideBarData.ratingFour}/>
        </Col>
      </Row>
      <Row className="mt-2 w-100">
        <Col className="pe-0 ms-2 me-2">
          <Button variant="outline-primary" className="w-100">
            <div className="sidebar-button">
              <GrAdd color="blue" className="me-2"/> 添加动画 <GrAdd color="blue" className="ms-2"/>
            </div>
          </Button>
        </Col>
      </Row>
    </div>
  )
}

export default MySideBar;