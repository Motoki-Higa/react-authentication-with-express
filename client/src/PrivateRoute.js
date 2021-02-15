import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Consumer } from './Context';

// ({ component: Component, ...rest }) is basically renaming the "component" variables to "Component" while destructuring.
// It's a usual JavaScript feature to extract properties from objecs and bind them to variables. 
export default ({ component: Component, ...rest }) => {
  return (
    <Consumer>
      { context => (
        <Route
          {...rest}
          render={props => context.authenticatedUser ? (
              <Component {...props} />
            ) : (
              <Redirect to='/signin' />
            )
          }
        />
      )}
    </Consumer>
  );
};