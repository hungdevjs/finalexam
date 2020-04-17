import axios from 'axios'
import getAccessToken from '../getAccessToken'

const request = axios.create({
    baseURL: "http://localhost:5000/",
    timeout: 3000,
    headers: {
        "Content-Type": "application/json",
    }
})

request.interceptors.request.use(
    config => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config
    },
    error => Promise.reject(error)
)

export default () => request.get("user/getUserInformation")
