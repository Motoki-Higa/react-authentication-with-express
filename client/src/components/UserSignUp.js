import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Form from './Form';

function UserSignUp({ context }){
  // states
  const [ user, setUser ] = useState({name: '', username: '', password: ''});
  const [ errors, setErrors ] = useState('');

  // history hook
  let history = useHistory();

  const handleChange = (e) => {
    const { value, name } = e.target;
    setUser({...user, [name]: value });
  }

  const handleSubmit = () => {
    context.actions.signUp(user)
      .then( err => {
        if (err.length) {
          setErrors(err);
        } else {
          console.log(`${username} is successfully signed up and authenticated!`);

          context.actions.signIn(user.username, user.password)
            .then(() => {
              history.push('/authenticated');
            })
        }
      })
      .catch( err => setErrors(err)); 
  }

  const handleCancel = () => {
    history.push('/');
  }

  return (
    <div className="bounds">
      <div className="grid-33 centered signin">
        <h1>Sign Up</h1>
        <Form 
          cancel={ handleCancel }
          errors={ errors }
          submit={ handleSubmit }
          submitButtonText="Sign Up"
          elements={() => ( // render prop
            <React.Fragment>
              <input 
                id="name" 
                name="name" 
                type="text"
                onChange={ handleChange } 
                placeholder="Name" />
              <input 
                id="username" 
                name="username" 
                type="text"
                onChange={ handleChange } 
                placeholder="User Name" />
              <input 
                id="password" 
                name="password"
                type="password"
                onChange={ handleChange } 
                placeholder="Password" />
            </React.Fragment>
          )} />
        <p>Already have a user account? <Link to="/signin">Click here</Link> to sign in!</p>
      </div>
    </div>
  );

}

export default UserSignUp;