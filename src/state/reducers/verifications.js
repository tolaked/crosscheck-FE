import * as types from "../actionTypes/verifications";

const initialState = {
  verifications: [],
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case types.ADD_VERIFICATIONS:
      return {
        ...state,
        verifications: [...action.payload],
      };
    case types.DELETE_VERIFICATION:
      let newArr = [];
      state.verifications.filter((verification) => {
        for (var pair of verification.entries()) {
          if (pair[0] === "institution" && pair[1] !== action.payload) {
            newArr.push(verification);
          }
        }
      });
      return {
        verifications: newArr,
      };

    default:
      return state;
  }
}