import {
  TOGGLE_LOADING_SPINNER_OFF,
  TOGGLE_LOADING_SPINNER_ON,
  UPDATE_START_SEARCH_DATE,
  UPDATE_END_SEARCH_DATE
} from "../constants/action-types";

export const isLoading = (isLoading) => {
  return isLoading ?
    { type: TOGGLE_LOADING_SPINNER_ON, payload: isLoading } :
    { type: TOGGLE_LOADING_SPINNER_OFF, payload: isLoading }
};

export const updateStartSearchDate = (startDate) => {
  return { type: UPDATE_START_SEARCH_DATE, payload: startDate }
};

export const updateEndSearchDate = (endDate) => {
  return { type: UPDATE_END_SEARCH_DATE, payload: endDate }
};
