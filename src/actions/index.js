import { TOGGLE_LOADING_SPINNER_OFF } from "../constants/action-types";

export const isLoading = isLoading => ({ type: TOGGLE_LOADING_SPINNER_OFF, payload: isLoading });
