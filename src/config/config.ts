const prfixBaseUrl = (url: string) => {
  const baseUrl = !__DEV__
    ? 'https://be-thin.maarkar.in'
    : 'http://localhost:4500';
  return `${baseUrl}/${url}`;
};

export default {
  baseURL: !__DEV__
    ? 'https://be-thin.maarkar.in/api/v1'
    : 'http://localhost:4500/api/v1',
  tokenStorageKey: 'User::Token',
  userDataStorageKey: 'User:Data',
  authorTermsAndConditionUrl: '#',
  authorAvatarPlaceholder:
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
  howToWritePostUrl: prfixBaseUrl('how-to-write.html'),
  contactUs: prfixBaseUrl('privacy.html#contact-us'),
  terms: prfixBaseUrl('toc.html'),
  privacy: prfixBaseUrl('privacy.html'),
  guidelines: prfixBaseUrl('guideline.html'),
};
