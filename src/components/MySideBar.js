import {Button, Col, Row} from "react-bootstrap";
import './MySideBar.css';
import SideBarItem from "./SideBarItem";
import { GrAdd } from "react-icons/gr";

function MySideBar() {
  return (
    <div className="col-4 col-xl-2 col-md-3 d-flex flex-column ms-0 p-0 sidebar-container">
      <Row className="sidebar-row sidebar-row__selected">
        <Col>
          <SideBarItem sideBarText="非常一般" />
        </Col>
      </Row>
      <Row className="sidebar-row">
        <Col>
          <SideBarItem sideBarText="有点意思"/>
        </Col>
      </Row>
      <Row className="sidebar-row">
        <Col>
          <SideBarItem sideBarText="好看"/>
        </Col>
      </Row>
      <Row className="sidebar-row">
        <Col>
          <SideBarItem sideBarText="神作"/>
        </Col>
      </Row>
      <Row className="mt-2 w-100">
        <Col>
          <Button variant="outline-primary" className="w-100">
            <div className="sidebar-button">
              <GrAdd color="blue" className="me-2" /> 添加动画 <GrAdd color="blue" className="ms-2" />
            </div>
          </Button>
        </Col>
      </Row>
    </div>
  )
}

export default MySideBar;