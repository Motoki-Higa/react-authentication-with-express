import React, { useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import config from './config';

const url = config.apiBaseUrl

const Context = React.createContext(); 

export function Provider(props){
  const [ authenticatedUser, setAuthenticatedUser ] = useState(Cookies.getJSON('authenticatedUser') || null)


  // func: sign up
  const signUp = async (user) => {
    const response = await axios.post(url + '/users', user)
      .then(response => {
        return response
      })
      .catch(err => {
        throw err.response.data.message;
      })
  
    return response;
  };


  // func: sign in
  const signIn = async (username, password) => {
    const encodedCredentials = btoa(`${ username }:${ password }`);

    const user = await axios.get(url + '/users', {
      headers: { authorization: `Basic ${encodedCredentials}`},
      withCredentials: true // this is needed for cors between react and express
    })
      .then(response => {
        setAuthenticatedUser(response.data)
        // Set cookie - 3 args: cookie name, value to store, expiration (optional)
        Cookies.set('authenticatedUser', JSON.stringify(response.data), { expires: 1 });
        return response.data;
      })
      .catch(err => {
        throw err.response.data.message; // 'throw' in catch() send error as return value
      });

    return user;
  }


  // func: sign out
  const signOut = () => {
    axios.get(url + '/signout', { withCredentials: true })
      .then(result => console.log(result.data.message));
    setAuthenticatedUser(null);
    Cookies.remove('authenticatedUser');
  }

  
  // this object will be passed to Context.provider
  const value = {
    authenticatedUser,
    actions: { // Add the 'actions' property and object
      signUp: signUp,
      signIn: signIn,
      signOut: signOut
    }
  };

  return (
    // actual value assigning 
    <Context.Provider value={ value } >
      { props.children }
    </Context.Provider>  
  );

}

export const Consumer = Context.Consumer;

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param {class} Component - A React component.
 * @returns {function} A higher-order component.
 */

export default function withContext(Component) {
  return function ContextComponent(props) {
    return (
      <Context.Consumer>
        {context => <Component {...props} context={context} />}
      </Context.Consumer>
    );
  }
}

