import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { signUpVendor } from "../../api/loginApi";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "/src/resources/assets/Logo/vendor_logo.svg";

const VendorSignUp = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signUpVendor({ name, email, password });
    if (result.status == 201 || result.status == 200) {
      navigate("/vendor-login");
    } else if (result.status == 400) {
      toast.error(result.response.data.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-logo">
        <img src={logo} id='desktop-version' alt="ToGathr"></img>
        <h2>Join Our Trusted ToGathr Vendor Network.</h2>
      </div>
      <div className="login-card">
        <img src={logo} id='mobile-version' alt="ToGathr"></img>
        <br />
        <h4 className="text-center">Get started now!</h4>
        <ToastContainer />
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
            to={`/vendor-login`}
            className="login-btn block text-sm font-medium"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VendorSignUp;
