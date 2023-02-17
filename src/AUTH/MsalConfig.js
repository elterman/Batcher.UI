export const msalConfig = (window).msalConfig;

// Coordinates and required scopes for your web api
export const apiConfig = (window).apiConfig;

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest = {
    scopes: ["openid", "profile", "offline_access"]
};

export const graphTokenRequest = {
  scopes: [
    "user.read"
  ]
}

export const apiTokenRequest = {
  scopes: [ 
    apiConfig.resourceScope
  ]
}