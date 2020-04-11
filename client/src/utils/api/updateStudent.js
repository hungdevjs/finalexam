import axios from 'axios'

export default (data, id) => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("access_token") || ''}`
    return axios.put(`http://localhost:5000/user/student/${id}`, data, { timeout: 30000 })
}