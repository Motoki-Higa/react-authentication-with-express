import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard({ context }){
  const authUser = context.authenticatedUser;

  // { withCredentials: true } is needed for cors (react and express)
  useEffect(() => {
    axios.get('http://localhost:5000/api/dashboard', { withCredentials: true })
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err.response.data.message);
      })
  },[])

  return (
    <div className="bounds">
      <div className="grid-100">
        <h1>{ authUser ? authUser.name : 'Guest'}</h1>
        {
          authUser ?
          <p>Your username is { authUser.username }.</p>
          :
          null
        }
        
      </div>
    </div>
  )
}

export default Dashboard