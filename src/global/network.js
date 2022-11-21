

const BASE_URL_DEBUG = 'http://127.0.0.1:8080';
const BASE_URL_PROD = 'http://119.23.188.171:8080';
const BASE_URL_WS_DEBUG = 'ws://127.0.0.1:8080/ws';
const BASE_URL_WS_PROD = 'ws://119.23.188.171:8080/ws';
export const BASE_URL = BASE_URL_DEBUG;
export const BASE_URL_WS = BASE_URL_WS_DEBUG;

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