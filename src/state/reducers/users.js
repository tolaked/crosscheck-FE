import * as types from "../actionTypes/users";

const initialState = {
  loading: false,
  registerError: "",
  loginError: "",
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case types.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case types.SET_ERROR:
      return {
        ...state,
        registerError: action.payload,
      };

    case types.LOGIN_ERROR:
      return {
        ...state,
        registerError: "",
        loginError: action.payload,
      };
    default:
      return state;
  }
}
