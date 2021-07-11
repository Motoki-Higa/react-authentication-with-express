import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Form from './Form';

function UserSignIn({ context }){
  // states
  const [ user, setUser ] = useState({username: '', password: ''});
  const [ errors, setErros ] = useState([]);

  let history = useHistory();

  const handleChange = (e) => {
    const { value, name } = e.target;
    setUser({...user, [name]: value });
  }

  const handleSubmit = () => {
    setUser({username: '', password: ''}); // for clearing fields

    // signIn is an aysnc function
    context.actions.signIn(user.username, user.password)
      .then( user => {
        if (user === null) {
          setErros(['Sign-in was unsuccessful'])
        } else {
          history.push('/authenticated');
          console.log(`SUCCESS! ${ user.username } is now signed in!`);
        }
      })
      .catch( err => {
        console.log(err);
        history.push('/error');
      })
  }

  const handleCancel = () => {
    history.push('/');
  }

  return (
    <div className="bounds">
      <div className="grid-33 centered signin">
        <h1>Sign In</h1>
        <Form 
          cancel={ handleCancel }
          errors={ errors }
          submit={ handleSubmit }
          submitButtonText="Sign In"
          elements={() => (
            <React.Fragment>
              <input 
                id="username" 
                name="username" 
                type="text"
                value={ user.username } 
                onChange={ handleChange } 
                placeholder="User Name" />
              <input 
                id="password" 
                name="password"
                type="password"
                value={ user.password } 
                onChange={ handleChange } 
                placeholder="Password" />                
            </React.Fragment>
          )} />
        <p>Don't have a user account? <Link to="/signup">Click here</Link> to sign up!</p>
      </div>
    </div>
  );

}

export default UserSignIn;
