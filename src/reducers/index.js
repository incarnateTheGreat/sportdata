import {
  TOGGLE_LOADING_SPINNER_OFF,
  TOGGLE_LOADING_SPINNER_ON,
  UPDATE_START_SEARCH_DATE,
  UPDATE_END_SEARCH_DATE
} from "../constants/action-types";

const initialState = {
  isLoading: false,
  startDate: null,
  endDate: null
};

const rootReducer = (state = initialState, action) => {
  // console.log(action);
  switch (action.type) {
    case TOGGLE_LOADING_SPINNER_ON:
      return { ...state, isLoading: action.payload };
    case TOGGLE_LOADING_SPINNER_OFF:
      return { ...state, isLoading: action.payload };
    case UPDATE_START_SEARCH_DATE:
      return { ...state, startDate: action.payload };
    case UPDATE_END_SEARCH_DATE:
      return { ...state, endDate: action.payload };
    default:
      return state;
  }
};

export default rootReducer;
