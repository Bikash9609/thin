export default {
  baseURL: !__DEV__
    ? 'https://thin-be.onrender.com/api/v1'
    : 'http://localhost:4500/api/v1',
  tokenStorageKey: 'User::Token',
  authorTermsAndConditionUrl: '#',
  authorAvatarPlaceholder:
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
};
