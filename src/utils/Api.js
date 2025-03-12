class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  getAppInfo() {
    //call getUserInfo in this array
    return Promise.all([this.getInitialCards()]);
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      Promise.reject(`Error:${res.status}`);
    });
  }

  // create another method, getUserInfo (different base url)
  getUserInfo() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      Promise.reject(`Error:${res.status}`);
    });
  }
}

// export the class
export default Api;
