import { apiConfig } from './AUTH/MsalConfig';

const getAccess = (auth, resolve) => auth.getAccessToken().then((ar) => resolve(ar));

export const doFetch = (request, auth, resolve, text = false) => {
  getAccess(auth, (authResult) => {
    const init = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authResult.accessToken}`,
        'Content-Type': 'application/json',
      },
    };

    const req = `${apiConfig.resourceUri}/${request}`;
    console.log(req);

    fetch(req, init)
      .then((res) => {
        return res.ok ? (text ? res.text() : res.json()) : Promise.reject({ status: res.status, message: res.statusText });
      })
      .then((data) => {
        const err = data.ErrorMessage && data.ErrorMessage !== '';
        resolve({ ok: !err, data }); // if err, basically passing data.ErrorMessage to toast
      })
      .catch((err) => {
        resolve({ ok: false, data: { ErrorMessage: err.message || `ERROR: ${err.status}` } });
      });
  });
};
