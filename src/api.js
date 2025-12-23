import axios from "axios";

const api = axios.create({
    baseURL:"https://excel-helper-server.onrender.com",
    headers:{
        "Content-Type":"application/json"
    }
})

export default api;