import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import './MyNavBar.css';
import {BASE_URL, GET} from "../global/network";
import {useNavigate} from "react-router-dom";

function MyNavBar(props) {
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