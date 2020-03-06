import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
//import { createLogger } from "redux-logger";
import rootReducer from "../Reducers";

//const middleware = [thunkMiddleware, createLogger];

/* if (process.env.NODE_ENV !== "production") {
    middleware.push(createLogger());
} */

const Store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

export default Store;
