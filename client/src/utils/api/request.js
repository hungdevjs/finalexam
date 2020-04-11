import axios from "axios"

const request = axios.create({
    baseURL: "http://localhost:5000/",
    timeout: 3000,
    headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
    },
})

export default request
