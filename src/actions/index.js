import {
  TOGGLE_LOADING_SPINNER_OFF,
  TOGGLE_LOADING_SPINNER_ON
} from "../constants/action-types";

export const isLoading = (isLoading) => {
  // console.log('Actions:', isLoading);

  return isLoading ?
        { type: TOGGLE_LOADING_SPINNER_ON, payload: isLoading } :
        { type: TOGGLE_LOADING_SPINNER_OFF, payload: isLoading }
  // return { type: TOGGLE_LOADING_SPINNER_OFF, payload: isLoading }
};
