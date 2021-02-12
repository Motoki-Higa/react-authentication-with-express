import React, { Component } from 'react';
import Data from './Data';

const Context = React.createContext(); 

export class Provider extends Component {

  constructor() {
    super();
    this.data = new Data();
  }

  signIn = async (username, password) => {
    // Behind the scene of getUser():
    // get username and password, and convert to Base64-encoded ASCII string,
    // then create and add an authorization header for the request to backend,
    // then get the response(this case hashed 'user')
    const user = await this.data.getUser(username, password);
    return user;
  }

  signOut = () => {

  }

  render() {
    const value = {
      data: this.data,
      actions: { // Add the 'actions' property and object
        signIn: this.signIn
      }
    };

    return (
      <Context.Provider value={ value } >
        {this.props.children}
      </Context.Provider>  
    );
  }

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

