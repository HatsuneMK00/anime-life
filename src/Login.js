import React, {useEffect, useState} from 'react';
import './Login.css'
import {Button, Container, Form, InputGroup} from "react-bootstrap";
import {BASE_URL, POST} from "./global/network";
import {useNavigate} from "react-router-dom";
import {AiOutlineMail} from "react-icons/ai";
import {BiKey} from "react-icons/bi";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sendCodeCD, setSendCodeCD] = useState(0);
  // 0 stands for password login, 1 stands for email login
  const [loginType, setLoginType] = useState(1);
  const [showLoading, setShowLoading] = useState(false);
  const [showErrMsg, setShowErrMsg] = useState(false);
  const navigate = useNavigate();

  function handleSubmitClicked(event) {
    event.preventDefault();
    setShowLoading(true);
    setShowErrMsg(false);

    const requestData = {
      username: username,
      password: password,
      email: email,
      code: code,
      loginType: loginType,
    }
    POST(`${BASE_URL}/login`, requestData)
      .then(data => {
        setShowLoading(false);
        if (data.code === 200) {
          localStorage.setItem('token', data.token);
          navigate('/anime_record');
          console.log('login success');
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

  function onCardFlipClicked() {
    if (loginType === 0) {
      setLoginType(1);
    } else {
      setLoginType(0);
    }
  }

  function onSendCodeClicked() {
    setSendCodeCD(60);
  }

  useEffect(() => {
    const countdown = setInterval(() => {
      setSendCodeCD(sendCodeCD - 1);
    }, 1000)

    if (sendCodeCD === 0) {
      clearInterval(countdown);
    }

    return () => clearInterval(countdown);
  }, [sendCodeCD])

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-card__via-email-btn" onClick={() => onCardFlipClicked()}>
          {loginType === 0 ? <AiOutlineMail className="me-2"/> :
            <BiKey className="me-2"/>} {loginType === 0 ? 'Via Email' : 'Via Password'}
        </div>
        <Container className="login-form">
          <h1 className="login-form__title mb-5">{loginType === 0 ? 'Password Login' : "Email Login"}</h1>
          <Form className="login-form__inner" onSubmit={(event) => handleSubmitClicked(event)}>
            {loginType === 0 ?
              <Form.Group className="mb-4" controlId="username">
                <Form.Control
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}/>
              </Form.Group> :
              <InputGroup className="mb-4">
                <Form.Control
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}/>
                <Button className="w-25" variant="outline-light" id="send-code-btn" disabled={sendCodeCD > 0} onClick={() => onSendCodeClicked()}>
                  {sendCodeCD > 0 ? `${sendCodeCD}s` : 'Send Code'}
                </Button>
              </InputGroup>}

            {loginType === 0 ?
              <Form.Group className="mb-4" controlId="password">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}/>
              </Form.Group> :
              <Form.Group className="mb-4" controlId="code">
                <Form.Control
                  type="text"
                  placeholder="Code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}/>
              </Form.Group>}

            {showErrMsg &&
              <div className="login-form__err-msg">
                <Form.Text className="login-form__err-msg">
                  {loginType === 0 ? '用户名或密码错误' : '邮箱或验证码错误'}
                </Form.Text>
              </div>
            }

            <div className="m-auto pt-3 align-items-center d-flex flex-column">
              <Button variant="outline-light" className="w-50 login__btn" disabled={showLoading} type="submit">
                {showLoading ? '正在登录...' : '登录'}
              </Button>
            </div>
          </Form>
        </Container>
      </div>
    </div>
  )
}

export default Login