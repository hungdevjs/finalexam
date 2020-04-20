import { getAllUser } from "../../utils/api/fetchData";
import setLoading from "./setLoading";

export default (
    role,
    searchString = "",
    filterClass = "",
    filterGrade = "",
    filterSubject = ""
) => async (dispatch) => {
    dispatch(setLoading(true));

    try {
        const res = await getAllUser(
            role,
            searchString,
            filterClass,
            filterGrade,
            filterSubject
        );
        dispatch(setLoading(false));
        return res.data.data;
    } catch (err) {
        console.log(err.message);
    }

    dispatch(setLoading(false));
};
