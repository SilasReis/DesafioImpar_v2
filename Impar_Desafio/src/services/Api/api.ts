import axios from 'axios';

const api = axios.create({
    baseURL:  "https://app-silasreis-api.azurewebsites.net"
})

export default api;