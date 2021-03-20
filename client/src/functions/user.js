import axios from "axios";

export const userCart = async (cart, authtoken) => {
    return await axios.push(
        `${process.env.REACT_APP_API}/user/cart`,
        { cart },
        {
            headers: {
                authtoken,
            },
        }
    );
};
