import products from "../product.json";
import { FETCH } from "../constants/actionTypes";

export const getProducts = () => async (dispatch) => {
    try {
        console.log("getProducts");
        const loadedData = await JSON.parse(JSON.stringify(products));
        var payload = { "Basic": [], "Sunscreen": [], "Makeup": [], "Bodycare": [] };

        loadedData.map((obj) => {
            var category = obj["categoryName"];
            const index = category.indexOf(",");
            var mainCategory = category.slice(0, index)

            payload[mainCategory].push(obj);
        });

        dispatch({ type: FETCH, payload: payload }); // action type and info sent to the store
    } catch (error) {
        console.log(error);
    }
}
