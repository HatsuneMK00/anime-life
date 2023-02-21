import {Button, Container, Form, Nav, Navbar, NavDropdown} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import './MyNavBar.css';
import {useDispatch, useSelector} from "react-redux";
import {setSearchText} from "../store/searchTextSlice";
import {BASE_URL, GET} from "../global/network";
import {useNavigate} from "react-router-dom";
import {toggleGoSearch} from "../store/goSearchSlice";

function MyNavBar(props) {
  // FIXME search text dispatch action every time when the search text is changed
  const searchText = useSelector(state => state.searchText.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    GET(`${BASE_URL}/api/user/info`)
      .then(data => {
        if (data.code === 200) {
          setUserName(data.data.username)
        } else {
          setUserName('Unknown');
        }
      })
  }, []);

  function handleSearchClicked() {
    dispatch(toggleGoSearch())
    props.setChosenSideBarItem(-2)
  }

  function handleLogoutClicked() {
    localStorage.removeItem('token');
    navigate('/login');
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
            <NavDropdown title={userName} id="basic-nav-dropdown" className="">
              <NavDropdown.Item href="#action/3.1" onClick={() => handleLogoutClicked()}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavBar;