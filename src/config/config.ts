export default {
  baseURL: !__DEV__
    ? 'https://thin-be.onrender.com/api/v1'
    : 'http://localhost:4500/api/v1',
  tokenStorageKey: 'User::Token',
};
