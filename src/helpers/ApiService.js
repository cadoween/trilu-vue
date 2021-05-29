class ApiService {
  constructor() {
    this.API_URL = "http://localhost:8000/";
    this.API_PREFIX = "v1/";
  }

  get(url) {
    return fetch(
      `${this.API_URL}${this.API_PREFIX}${url}?token=${localStorage.getItem(
        "token"
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => res);
  }

  post(url, data) {
    return fetch(
      `${this.API_URL}${this.API_PREFIX}${url}?token=${localStorage.getItem(
        "token"
      )}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    ).then((res) => res);
  }

  put(url, data) {
    return fetch(
      `${this.API_URL}${this.API_PREFIX}${url}?token=${localStorage.getItem(
        "token"
      )}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    ).then((res) => res);
  }

  delete(url) {
    return fetch(
      `${this.API_URL}${this.API_PREFIX}${url}?token=${localStorage.getItem(
        "token"
      )}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => res);
  }
}

const apiService = new ApiService();

export default apiService;
