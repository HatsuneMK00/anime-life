import './LiveSearch.css'

import React, {useEffect, useState} from 'react';
import {Form, ListGroup} from "react-bootstrap";
import {BANGUMI_BASE_URL} from "../global/network";
import Loading from "./Loading";

/*
* This is a live search component for adding new anime record.
* */
function LiveSearch(props) {
  // const [animeName, setAnimeName] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [showSearchResult, setShowSearchResult] = useState(false)
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(0)
  const fetchAnimeCandidates = (s) => {
    const url = `${BANGUMI_BASE_URL}/search/subject/${s}?type=2&responseGroup=small&max_results=5`
    if (s.trim() === "") {
      setLoading(false)
      setShowSearchResult(false)
      return
    }
    fetch(encodeURI(url), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    })
      .then(res => {
        return res.json()
      })
      .then(data => {
        setSearchResult(data.list.map((item) => {
          return item.name_cn === "" ? item.name : item.name_cn
        }))
      })
      .finally(() => {
        setLoading(false)
      })
  }
  const handleChange = (value) => {
    props.setAnimeName(value)
    // set a timer of 1.5s to send a request to bangumi api
    // if the user doesn't type anything in 1.5s, then send the request
    // if the user types something in 1.5s, then cancel the timer and set a new timer
    clearTimeout(timer)
    setLoading(true)
    setShowSearchResult(true)
    const newTimer = setTimeout(() => {
      fetchAnimeCandidates(value)
    }, 1500)
    setTimer(newTimer)
  }
  const handleItemSelected = (index) => {
    setShowSearchResult(false)
    props.setAnimeName(searchResult[index])
  }

  // To clear any potential timeout if this page exits
  useEffect(() => {
    return clearTimeout(timer)
  }, [])

  return (
    <>
      <div style={{
        width: '100%',
        position: 'relative',
      }}>
        <Form.Control
          type="text"
          value={props.animeName}
          onChange={event => handleChange(event.target.value)}
          placeholder="动画名称"
          onBlur={() => setShowSearchResult(false)}
          className="live-search__input"/>
        {showSearchResult && <div className="search-result__container">
          {!loading ? <ListGroup>
            {
              searchResult.map((item, index) => {
                return <ListGroup.Item className="search-result__item" key={index}
                                       onClick={() => handleItemSelected(index)}>{item}</ListGroup.Item>
              })
            }
          </ListGroup> : <div className="search-result__loading ms-auto me-auto mt-2 mb-2"><Loading/></div>}
        </div>}
      </div>
    </>
  );
}

export default LiveSearch;