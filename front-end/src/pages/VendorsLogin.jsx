import React from "react";
import { useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import { googleVendorAuth, vendorLogin } from "../../api/loginApi.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "/src/resources/assets/Logo/vendor_logo.svg";
import { useSnackbar } from "../components/SnackbarContext.jsx";

const VendorsLogin = () => {
  const showSnackbar = useSnackbar();
  const [password, setPassword] = useState();
  const [userEmail, setEmail] = useState([]);
  const [authenticateNavigate, setauthenticateNavigate] = useState(false);
  const navigate = useNavigate();
  useEffect(() => { }, [authenticateNavigate, navigate]);

  const responseGoogle = async (authResult) => {
    try {
      if (authResult["code"]) {
        const response = await googleVendorAuth(authResult["code"]);
        if (response.status == 200 || response.status == 201) {
          console.log(response.data.vendor, "response from login");
          saveVendorInfoInLocalStorage(
            response.data.vendor,
            response.data.token
          );
          navigate("/vendor-portal");
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      console.log("Error while requesting google", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await vendorLogin({
        userEmail: userEmail,
        password: e.target.password.value,
      });
      if (response.status == 200 || response.status == 201) {
        console.log(
          response.data.vendor,
          response.data.token,
          "response from login"
        );
        saveVendorInfoInLocalStorage(response.data.vendor, response.data.token);
        navigate("/vendor-portal");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const saveVendorInfoInLocalStorage = (vendor, token) => {
    localStorage.setItem(
      "vendor-user-info",
      JSON.stringify({
        firstName: vendor.firstName,
        lastName: vendor.lastName,
        email: vendor.email,
        phone: vendor.phone,
        name: vendor.name,
        image:
          vendor.image ||
          "https://togather-aws-image.s3.us-east-1.amazonaws.com/anonymous-image.png",
        type: vendor.type,
        token: token,
      })
    );
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });
  return (
    <div className="login-container">
      <div className="login-logo vendors-login">
        <img src={logo} id='desktop-version' style={{ position: "absolute", right: "0" }} alt="ToGathr"></img>
        <h2 style={{ margin: "2rem 7rem 2rem 3rem" }}>Join Our Trusted ToGathr Vendor Network</h2>
      </div>

      <div className="login-card">
        <img src={logo} id='mobile-version' alt="ToGathr"></img>
        <br />
        <h4 className="text-center mb-6">Welcome Back!</h4>
        <ToastContainer />
        <form onSubmit={handleSubmit}>
          <div className="login-form-fields">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="name@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              required
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
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 text-white rounded-md"
          >
            Login
          </button>
        </form>
        <div className="divider-container">
          <hr className="divider-line" />
          <span className="divider-text">Or</span>
          <hr className="divider-line" />
        </div>
        <button className="google-btn" onClick={googleLogin}>
          <svg
            width="29"
            height="28"
            viewBox="0 0 29 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M25.568 11.7307H24.6346V11.6826H14.2053V16.3178H20.7543C19.7988 19.0161 17.2315 20.9531 14.2053 20.9531C10.3656 20.9531 7.25242 17.8399 7.25242 14.0002C7.25242 10.1605 10.3656 7.04735 14.2053 7.04735C15.9777 7.04735 17.5902 7.71598 18.8179 8.80816L22.0956 5.53046C20.026 3.60163 17.2576 2.41211 14.2053 2.41211C7.80575 2.41211 2.61719 7.60068 2.61719 14.0002C2.61719 20.3997 7.80575 25.5883 14.2053 25.5883C20.6048 25.5883 25.7934 20.3997 25.7934 14.0002C25.7934 13.2232 25.7134 12.4648 25.568 11.7307Z"
              fill="#FFC107"
            />
            <path
              d="M3.95312 8.60652L7.76039 11.3987C8.79057 8.84813 11.2855 7.04735 14.2051 7.04735C15.9775 7.04735 17.59 7.71598 18.8177 8.80816L22.0954 5.53046C20.0258 3.60163 17.2574 2.41211 14.2051 2.41211C9.75412 2.41211 5.89413 4.92499 3.95312 8.60652Z"
              fill="#FF3D00"
            />
            <path
              d="M14.2069 25.5888C17.2001 25.5888 19.9198 24.4433 21.9762 22.5805L18.3896 19.5456C17.2262 20.4269 15.78 20.9536 14.2069 20.9536C11.1929 20.9536 8.63363 19.0317 7.6695 16.3496L3.89062 19.2611C5.80845 23.0139 9.70321 25.5888 14.2069 25.5888Z"
              fill="#4CAF50"
            />
            <path
              d="M25.5697 11.7297H24.6363V11.6816H14.207V16.3169H20.756C20.2972 17.613 19.4634 18.7307 18.388 19.5447L18.3898 19.5436L21.9763 22.5785C21.7225 22.8091 25.7951 19.7933 25.7951 13.9993C25.7951 13.2223 25.7152 12.4638 25.5697 11.7297Z"
              fill="#1976D2"
            />
          </svg>
          Login with Google
        </button>
        <div className="login-footer">
          <span>Don't have an account? </span>
          <Link to={`/vendor-signup`}>Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default VendorsLogin;
