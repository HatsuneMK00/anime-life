

const BASE_URL_DEBUG = 'http://127.0.0.1:8080';
const BASE_URL_PROD = 'http://backend:8080';
const BASE_URL_WS_DEBUG = 'ws://127.0.0.1:8080/ws';
const BASE_URL_WS_PROD = 'ws://backend:8080/ws';
export const BASE_URL = process.env.NODE_ENV === 'production' ? BASE_URL_PROD : BASE_URL_DEBUG;
export const BASE_URL_WS = process.env.NODE_ENV === 'production' ? BASE_URL_WS_PROD : BASE_URL_WS_DEBUG;
export const BANGUMI_BASE_URL = 'https://api.bgm.tv';

export function GET(url) {
  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // 'Accept': 'application/json',
      'Authorization': ('Bearer ' + localStorage.getItem('token')) || ''
    }
  })
    .then(res => {
      if (res.status === 401) {
        localStorage.removeItem('token');
        console.log('token expired');
        window.location.replace('/login');
        return Promise.reject('unauthorized');
      }
      return res.json();
    })
}

export function POST(url, data) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': ('Bearer ' + localStorage.getItem('token')) || ''
    },
    body: JSON.stringify(data)
  })
    .then(res => {
      if (res.status === 401) {
        localStorage.removeItem('token');
        console.log('token expired');
        window.location.replace('/login');
        return Promise.reject('unauthorized');
      }
      return res.json();
    })
}