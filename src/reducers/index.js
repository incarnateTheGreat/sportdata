import {
  TOGGLE_LOADING_SPINNER_OFF,
  TOGGLE_LOADING_SPINNER_ON,
  UPDATE_START_SEARCH_DATE,
  UPDATE_END_SEARCH_DATE,
  UPDATE_LEAGUE_SELECTION
} from "../constants/action-types";

const initialState = {
  isLoading: false,
  startDate: null,
  endDate: null,
  leagueSelection: null
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_LOADING_SPINNER_ON:
      return { ...state, isLoading: action.payload };
    case TOGGLE_LOADING_SPINNER_OFF:
      return { ...state, isLoading: action.payload };
    case UPDATE_START_SEARCH_DATE:
      return { ...state, startDate: action.payload };
    case UPDATE_END_SEARCH_DATE:
      return { ...state, endDate: action.payload };
    case UPDATE_LEAGUE_SELECTION:
      return { ...state, leagueSelection: action.payload };
    default:
      return state;
  }
};

export default rootReducer;
