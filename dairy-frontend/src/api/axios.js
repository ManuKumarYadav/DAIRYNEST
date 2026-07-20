import axios from "axios";

const API = axios.create({
  baseURL: "https://dairy-backend4.onrender.com",
});

export default API;