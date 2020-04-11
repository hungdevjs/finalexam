import axios from 'axios'
import setLoading from './setLoading'

export default userInfo => async dispatch => {
    dispatch(setLoading(true))

    try {
        const res = await axios.post('http://localhost:5000/user', userInfo, { timeout: 30000 })

        if (res.status === 201) {
            
        } else {
            throw new Error('Create user failed')
        }
   } catch (err) {
        console.log(err.message)
    }

    dispatch(setLoading(false))
}