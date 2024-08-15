import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

axios.defaults.withCredentials = true;
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({type:"", text:""});
  const navigate = useNavigate();


  // axios.defaults.withCredentials=true;
  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      const response= await axios.post('http://localhost:8080/user/login',{email,password}, { withCredentials: true });
      if(response.data.success){
        // setMessage({type:"success", text:response.data.success});
        sessionStorage.setItem("message", JSON.stringify({type:"success", text:response.data.success}));
        navigate("/");
      }
      else if(response.data.failure){
        setMessage({type:"failure", text:response.data.failure});
      }
    } catch(err){
        if(err.response){
          setMessage({type:"failure", text:err.response.data.failure});
      }
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
      {message.text && (
                    <div className={`alert alert-${message.type==='success' ? 'success':'danger'}`}>
                        {message.text}
                    </div>
                )}
      <div className='bg-white p-3 rounded w-25'>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder='Enter Email'
              className="form-control rounded-0"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='mb-3'>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder='Enter Password'
              className="form-control rounded-0"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className='btn btn-success w-100'>Login</button>
          {/* <p>You agree to our terms and policies</p> */}
          <Link to="/register" className='btn btn-default border w-100 bg-light'>Create Account</Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
