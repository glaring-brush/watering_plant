const TOKEN_SAVE = 'TOKEN_SAVE';
const TOKEN_DESTROY = 'TOKEN_DESTROY';
const USER_SAVE = 'USER_SAVE';
const USER_CLEAR = 'USER_CLEAR';
const REQUEST_USER_LOGIN = 'REQUEST_USER_LOGIN';

export const saveToken = (apiToken) => ({
  type: TOKEN_SAVE,
  apiToken,
});

export const destroyToken = () => ({
  type: TOKEN_DESTROY,
});

export const saveUser = (user) => ({
  type: USER_SAVE,
  user,
});

export const clearUser = () => ({
  type: USER_CLEAR,
});

export const requestUserLogin = (credentials, handleLoginSuccess, handleLoginFail) => ({
  type: REQUEST_USER_LOGIN,
  credentials,
  handleLoginSuccess,
  handleLoginFail,
});

const authInitialState = {
  apiToken: '',
  user: {},
};

export const auth = (state = authInitialState, action) => {
  switch (action.type) {
    case TOKEN_SAVE:
      return { ...state, apiToken: action.apiToken };
    case TOKEN_DESTROY:
      let { apiToken, ...other } = state;
      return { ...other };
    case USER_SAVE:
      return { ...state, user: action.user };
    case USER_CLEAR:
      return { ...state, user: {} };
    default:
      return state;
  }
};

export default auth;
