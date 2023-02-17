// These entries are replaced by tokenization of index.release.html during release, this version of index.html is never deployed
window.msalConfig = {
  auth: {
    clientId: '1a21d853-f608-4f0e-b54f-159e8b22565c',
    authority: 'https://login.microsoftonline.com/337b9f7b-9e69-4689-9b0d-3417bd3d8566',
    validateAuthority: true,
    redirectUri: 'http://localhost:3000',
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

window.apiConfig = {
  resourceUri: 'https://baddevapieu2.azurewebsites.net',
  // resourceUri: 'http://localhost:8000',
  resourceScope: 'api://24921173-650d-4de5-a27e-7bc30ef057fc/user_impersonation',
};
