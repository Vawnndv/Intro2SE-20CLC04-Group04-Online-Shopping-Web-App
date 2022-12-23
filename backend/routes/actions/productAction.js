import Axios from 'axios';
export const createReview =
    (productId, review) => async (dispatch, getState) => {
        dispatch({ type: PRODUCT_REVIEW_CREATE_REQUEST });
        const {
            userSignin: { userInfo },
        } = getState();
        try {
            const { data } = await Axios.post(
                `/api/products/${productId}/reviews`,
                review,
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                }
            );
            dispatch({
                type: PRODUCT_REVIEW_CREATE_SUCCESS,
                payload: data.review,
            });
        } catch (error) {
            const message =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message;
            dispatch({ type: PRODUCT_REVIEW_CREATE_FAIL, payload: message });
        }
    };