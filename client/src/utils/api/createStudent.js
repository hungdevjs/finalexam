import axios from 'axios'

export default data => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("access_token") || ''}`
    return axios.post(`http://localhost:5000/user/student/create`, data, { timeout: 30000 })
}