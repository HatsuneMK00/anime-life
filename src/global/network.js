

export const BASE_URL = 'http://127.0.0.1:8080';
export const BASE_URL_DEBUG = 'http://127.0.0.1:8080';

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