import config from './config';

export default class Utils {

  // helper mothod: this will help to construct a request before send it to fetch()
  api(path, method = 'GET', body = null, requiresAuth = false, credentials = null) {
    const url = config.apiBaseUrl + path;
  
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }

    // Check if auth is required
    if (requiresAuth) {
      // creates a Base64-encoded ASCII string
      const encodedCredentials = btoa(`${credentials.username}:${credentials.password}`);

      // Add authorization header to the request
      options.headers['Authorization'] = `Basic ${encodedCredentials}`;
      options.credentials = 'include'
    }

    // do the actual http request to the backend endpoint in express
    return fetch(url, options);
  }

  async getUser(username, password) {
    // Use api() helper method to request and gets response
    const response = await this.api(`/users`, 'GET', null, true, { username, password });

    if (response.status === 200) {
      return response.json().then(data => data);
    }
    else if (response.status === 401) {
      return null;
    }
    else {
      throw new Error();
    }
  }
  
  async createUser(user) {
    // Use api() helper method to request and gets response
    const response = await this.api('/users', 'POST', user);
  
    if (response.status === 201) {
      return [];
    }
    else if (response.status === 400) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else {
      throw new Error();
    }
  }
}
