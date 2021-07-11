import React, { useState } from 'react';
import Cookies from 'js-cookie';
import Utils from './Utils';
import axios from 'axios';

const Context = React.createContext(); 

export function Provider(props){
  const [ authenticatedUser, setAuthenticatedUser ] = useState(Cookies.getJSON('authenticatedUser') || null)

  // get utils with object constructor. (Utils comes with 'createUser' and 'getUser' functions)
  const utils = new Utils();

  const signIn = async (username, password) => {
    // Behind the scene of getUser():
    // get username and password, and convert to Base64-encoded ASCII string,
    // then create and add an authorization header for the request to backend,
    // then get the response(this case matched 'user')
    const user = await utils.getUser(username, password);

    if (user !== null) {
      setAuthenticatedUser(user)
      // Set cookie - 3 args: cookie name, value to store, expiration (optional)
      Cookies.set('authenticatedUser', JSON.stringify(user), { expires: 1 });
    }
  
    return user;
  }

  const signOut = () => {
    axios.get('http://localhost:5000/api/signout', { withCredentials: true })
      .then(result => console.log(result.data.message));
    setAuthenticatedUser(null);
    Cookies.remove('authenticatedUser');
  }

  // this object will be passed to Context.provider
  const value = {
    authenticatedUser,
    actions: { // Add the 'actions' property and object
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

