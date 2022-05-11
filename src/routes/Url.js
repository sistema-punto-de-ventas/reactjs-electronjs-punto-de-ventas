import socketIoClient from 'socket.io-client';
import axios from 'axios';
export const Url = {
    // urlBackEnd:'https://serverfood-api.herokuapp.com',
    urlBackEnd:'http://127.0.0.0:4000',
    urlFrontEnd:'http://127.0.0.1:3000'
}
export default Url;
export const Socket = socketIoClient(Url.urlBackEnd);


