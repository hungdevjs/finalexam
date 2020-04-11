import axios from 'axios'

const renderParams = (root, params) => {
    if (!params) {
        return root
    }

    let url = `${root}/?`

    for (let key of Object.keys(params)) {
        url += `${key}=${params[key]}&`
    }

    return url
}

export const getAllUser = (role, searchString = '', filterClass = null, filterGrade = null, filterSubject = null) => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("access_token") || ''}`
    return axios.get(renderParams('http://localhost:5000/user/getAllUser', { role, searchString, filterClass, filterGrade, filterSubject}), { timeout: 30000 })
}

export const getAllClass = () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("access_token") || ''}`
    return axios.get('http://localhost:5000/information/getAllClass', { timeout: 30000 })
}

export const getAllSubject = () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("access_token") || ''}`
    return axios.get('http://localhost:5000/information/getAllSubject', { timeout: 30000 })
}

export const deleteUser = (role, id) => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("access_token") || ''}`
    return axios.delete(`http://localhost:5000/user/${role}/${id}`, { timeout: 30000 })
}