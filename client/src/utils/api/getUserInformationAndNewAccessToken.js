import axios from 'axios'

const request = axios.create({
    baseURL: "http://localhost:5000/",
    timeout: 3000,
    headers: {
        "Content-Type": "application/json",
    }
})

request.interceptors.request.use(
    config => {
        const token = localStorage.getItem('refresh_token') || "";
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config
    },
    error => Promise.reject(error)
)

export default () => request.get("user/getUserInformationAndNewAccessToken")
