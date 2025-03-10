class Api {
  constructor(options) {
    // constructor body
  }

  getInitialCards() {
    return fetch("https://around-api.en.tripleten-services.com/v1/cards", {
      headers: {
        authorization: "8c84c398-0400-4e0f-ba4f-d3192d94e573",
      },
    }).then((res) => res.json());
  }

  // other methods for working with the API
}

// export the class
export default Api;
