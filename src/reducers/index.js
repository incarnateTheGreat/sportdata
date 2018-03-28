import { TOGGLE_LOADING_SPINNER_OFF } from "../constants/action-types";

const initialState = {
  isLoading: true
};

const rootReducer = (state = initialState, action) => {
  console.log('action:', action);
  switch (action.type) {
    case TOGGLE_LOADING_SPINNER_OFF:
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

export default rootReducer;
