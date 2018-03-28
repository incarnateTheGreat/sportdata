import {
  TOGGLE_LOADING_SPINNER_OFF,
  TOGGLE_LOADING_SPINNER_ON
} from "../constants/action-types";

const initialState = {
  isLoading: false
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_LOADING_SPINNER_ON:
      return { ...state, isLoading: action.payload };
    case TOGGLE_LOADING_SPINNER_OFF:
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

export default rootReducer;
