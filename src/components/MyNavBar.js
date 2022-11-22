import {Button, Container, Form, Nav, Navbar, NavDropdown} from "react-bootstrap";
import React from "react";
import './MyNavBar.css';
import {useDispatch, useSelector} from "react-redux";
import {setSearchText} from "../store/searchTextSlice";
import {BASE_URL, GET} from "../global/network";
import {setRecordState} from "../store/animeRecordDataSlice";

function MyNavBar(props) {
  // FIXME search text dispatch action every time when the search text is changed
  const searchText = useSelector(state => state.searchText.value);
  const dispatch = useDispatch();

  function handleSearchClicked() {
    GET(`${BASE_URL}/api/anime_record/search?searchText=${searchText}`)
      .then(data => {
        data = data.data
        dispatch(setRecordState(data))
        props.setChosenSideBarItem(-2);
      })
      .catch(err => {
        console.log(err);
      })
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand href="#home">Anime Life</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto pe-md-5">
            <Form className="d-flex me-2">
              <Form.Control
                type="search"
                value={searchText}
                onChange={(e) => dispatch(setSearchText(e.target.value))}
                placeholder="查找动画"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success" onClick={() => handleSearchClicked()}>Search</Button>
            </Form>
            <NavDropdown title="User" id="basic-nav-dropdown" className="">
              <NavDropdown.Item href="#action/3.1">Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavBar;