const axios = require('axios')

export default grade => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("access_token") || ''}`
    return axios.get(`http://localhost:5000/grade/getAllClassOfGrade/${grade}`, { timeout: 30000 })
}