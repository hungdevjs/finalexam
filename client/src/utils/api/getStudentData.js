import axios from 'axios'

export default id => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("access_token") || ''}`
    return axios.get(`http://localhost:5000/user/student/${id}`, { timeout: 30000 })
}