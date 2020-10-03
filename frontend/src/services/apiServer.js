import axios from 'axios';

const apiServer = axios.create({
    baseURL: 'http://localhost:3333',
});

export default apiServer;