import axios from "axios";

const instance = axios.create({
  baseURL: "https://final-hrms-0-7-hrms-backend.onrender.com", // yahan tera backend Render link aayega
  withCredentials: true,
});

export default instance;
