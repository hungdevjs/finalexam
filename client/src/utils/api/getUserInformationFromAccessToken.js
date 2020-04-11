import axios from 'axios'


export default () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("access_token")}`
    return axios.get("http://localhost:5000/user/getUserInformation", { timeout: 30000 })
}