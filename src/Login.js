import React, {useState} from 'react';
import './Login.css'
import {Button, Container, Form} from "react-bootstrap";
import {BASE_URL} from "./global/network";
import {redirect} from "react-router-dom";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showLoading, setShowLoading] = useState(false);
  const [showErrMsg, setShowErrMsg] = useState(false);

  function handleSubmitClicked() {
    setShowLoading(true);
    setShowErrMsg(false);

    const requestData = {
      username: username,
      password: password,
    }
    fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)})
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setShowLoading(false);
        if (data.code === 200) {
          console.log(data.token);
          localStorage.setItem('token', data.token);
          redirect('/anime_record');
        } else if (data.code === 401) {
          setShowErrMsg(true);
        } else {
          setShowErrMsg(true);
        }
      })
      .catch(err => {
        console.log(err);
        setShowLoading(false);
        setShowErrMsg(true);
      });
  }

  return (
    <div className="login-container">
      <Container className="login-form">
        <h1 className="login-form__title mb-5">Login</h1>
        <Form className="login-form__inner">
          <Form.Group className="mb-4" controlId="username">
            <Form.Control
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}/>
          </Form.Group>

          <Form.Group className="mb-4" controlId="password">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}/>
          </Form.Group>

          {showErrMsg &&
            <div className="login-form__err-msg">
              <Form.Text className="login-form__err-msg">
                登录失败，请检查用户名或密码
              </Form.Text>
            </div>
          }

          <div className="m-auto pt-3 align-items-center d-flex flex-column">
            <Button variant="outline-primary" className="w-50" disabled={showLoading}
                    onClick={() => handleSubmitClicked()}>
              {showLoading ? '正在登录...' : '登录'}
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  )
}

export default Login