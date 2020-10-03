import axios from 'axios';

const api = axios.create({
    baseURL: 'http://167.99.21.74',
});

export default api;