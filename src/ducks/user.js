import * as R from 'ramda';

//----------------------------------------------------------------------------------model
export const model = () => ({
  email: undefined,
});

//-------------------------------------------------------------------------------------------actions
export const CHANGE_USER_EMAIL = '@@user/CHANGE_USER_EMAIL';
export const INTERACTIVE_USER_SIGNIN = '@@user/INTERACTIVE_USER_SIGNIN';

//------------------------------------------------------------------------------------------creators

export const changeUserEmail = (value) => ({
  type: CHANGE_USER_EMAIL,
  payload: { value },
});

//--------------------------------------------------------------------------------reducer
export default (state = model(), action = {}) => {
  switch (action.type) {
    case CHANGE_USER_EMAIL:
      return R.set(R.lensProp('email'), action.payload.value, state);
    default:
      return state;
  }
};
