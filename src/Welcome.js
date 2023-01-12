import React, {useEffect} from 'react';
import './Welcome.css';
import {useNavigate} from "react-router-dom";
import {Button} from "react-bootstrap";
import {sleep} from "./global/utils";

function Welcome() {
  const navigate = useNavigate()
  useEffect(() => {
    if (hasJWT()) {
      sleep(1000).then(r => navigate('/anime_record'))
    }
  }, [])

  return (
    <div className="bg-container">
      <h1>Record Your Anime Life</h1>
      { !hasJWT() &&
      <Button variant="outline-light" className="mt-2 to-login__btn" onClick={() => navigate('/login')}>
        开始记录
      </Button>
      }
    </div>
  )
}

function hasJWT() {
  return !!localStorage.getItem('token');
}


export default Welcome