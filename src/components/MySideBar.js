import {Button, Col, Row} from "react-bootstrap";
import './MySideBar.css';
import SideBarItem from "./SideBarItem";
import {GrAdd} from "react-icons/gr";
import {useEffect, useState} from "react";
import {BASE_URL, GET} from "../global/network";

function MySideBar(props) {
  const [sideBarData, setSideBarData] = useState({
    all: 0,
    ratingOne: 0,
    ratingTwo: 0,
    ratingThree: 0,
    ratingFour: 0,
  });

  useEffect(() => {
    GET(`${BASE_URL}/api/anime_record/summary`)
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

  function handleSideBarItemClicked(index) {
    props.choose(index);
    props.setSearchText('');
  }

  return (
    <div className="col-4 col-xl-2 col-md-3 d-flex flex-column ms-0 p-0 sidebar-container">
      <Row className={props.chosen === 0 ? "sidebar-row sidebar-row__selected" : "sidebar-row"}
           onClick={() => handleSideBarItemClicked(0)}>
        <Col className="pe-0">
          <SideBarItem sideBarText="所有记录" recordCount={sideBarData.all}/>
        </Col>
      </Row>
      <Row
        className={props.chosen === 1 ? "sidebar-row sidebar-row__selected" : "sidebar-row"}
        onClick={() => handleSideBarItemClicked(1)}>
        <Col className="pe-0">
          <SideBarItem sideBarText="非常一般" recordCount={sideBarData.ratingOne}/>
        </Col>
      </Row>
      <Row className={props.chosen === 2 ? "sidebar-row sidebar-row__selected" : "sidebar-row"}
           onClick={() => handleSideBarItemClicked(2)}>
        <Col className="pe-0">
          <SideBarItem sideBarText="有点意思" recordCount={sideBarData.ratingTwo}/>
        </Col>
      </Row>
      <Row className={props.chosen === 3 ? "sidebar-row sidebar-row__selected" : "sidebar-row"}
           onClick={() => handleSideBarItemClicked(3)}>
        <Col className="pe-0">
          <SideBarItem sideBarText="好看" recordCount={sideBarData.ratingThree}/>
        </Col>
      </Row>
      <Row className={props.chosen === 4 ? "sidebar-row sidebar-row__selected" : "sidebar-row"}
           onClick={() => handleSideBarItemClicked(4)}>
        <Col className="pe-0">
          <SideBarItem sideBarText="神作" recordCount={sideBarData.ratingFour}/>
        </Col>
      </Row>
      <Row className="mt-2 w-100">
        <Col className="pe-0 ms-2 me-2">
          <Button variant="outline-primary" className="w-100" onClick={() => props.showAddAnimeModal(true)}>
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