import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
import App from './components/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './views/Styles/main.css';
//css notifications
import 'react-toastify/dist/ReactToastify.css';
import 'izitoast/dist/css/iziToast.css';
//import reportWebVitals from './reportWebVitals';
import axios from 'axios';


// axios.defaults.baseURL = 'https://serverfood-api.herokuapp.com';
axios.defaults.baseURL = 'http://127.0.0.1:4000';
// axios.defaults.baseURL = 'http://192.168.100.9:4000';


//axios.defaults.headers.common['authorization'] = JSON.parse(localStorage.getItem('tokTC'))


ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
