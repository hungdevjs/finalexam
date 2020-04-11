import axios from 'axios'

export default () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("refresh_token")}`
    return axios.get("http://localhost:5000/user/getUserInformationAndNewAccessToken", { timeout: 30000 })
}