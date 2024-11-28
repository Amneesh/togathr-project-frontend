import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { signUpUser } from "../../api/loginApi.js";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import logo from "/src/resources/assets/Logo/whitelogo_togathr.svg";
import { useSnackbar } from '../components/SnackbarContext.jsx';
// import bcrypt from 'bcryptjs'; // Import bcrypt

export const SignUp = () => {
  const showSnackbar = useSnackbar();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const hasWorkspace = queryParams.has("workspace");
  console.log('hasWorkspace', hasWorkspace)

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const salt = await bcrypt.genSalt(10); // Generate a salt
    // const hashedPassword = await bcrypt.hash(password, salt); // Hash the password


    const signUpdata = {
      "name": name,
      "email": email,
      "password": password,
      "collectionName": "users"

    }
    console.log(name + " " + email + " " + password);
    // const result = await signUpUser({name, email, password});
    // const result = await signUpUser(signUpdata);
    signUpUser(signUpdata).then(response => {
      console.log('Response from createdData:', response);
      showSnackbar(response.message + " Please Login");
      if (!hasWorkspace) {
        console.log('nav');
        navigate("/login");
      } else {
        navigate("/login?workspace");
      }

    })
      .catch(error => {
        console.error('Failed to update data:', error);
        showSnackbar('Oops!', `try again`, '#FBECE7');

      });


    
  }


  return (
    <div className="login-container">
      <div className="login-logo">
        <img src={logo} alt="ToGathr"></img>
        <h2>Event planning simplified.</h2>
      </div>
      <div className="login-card">
        <h4 className="text-center">Sign Up to start planning!</h4>
        <form onSubmit={handleSubmit}>
          <div className="login-form-fields signup-header">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="enter your name"
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3"
            />
          </div>

          <div className="login-form-fields">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="name@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2"
            />
          </div>

          <div className="login-form-fields">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="eg. ******"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create an account
          </button>
        </form>
        <div className="login-footer">
          <span>Have an account?</span>
          <Link
            to={`/login`}
            className="login-btn block text-sm font-medium"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};
