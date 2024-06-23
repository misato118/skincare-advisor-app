import { FETCH } from "../constants/actionTypes";

const initialState = { "Basic": [], "Sunscreen": [], "Makeup": [], "Bodycare": [] };

function productsReducer(products = initialState, action) {
    if (action.type === "FETCH") {
        return action.payload
    }
    return products
}

export default productsReducer;