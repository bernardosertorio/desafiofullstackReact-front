import axios from 'axios';

const backendAPI = axios.create({
  baseURL: "http://localhost:8080"
});

export default backendAPI;