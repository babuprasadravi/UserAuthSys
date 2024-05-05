import { Link, Navigate } from "react-router-dom";
import styles from "../styles/Login.module.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from 'sonner'
import { authenticate, isAuth } from "./Helpers";
const Login = () => {
  const navigate = useNavigate();
    const [userData, setUserData] = useState({
      email: "",
      password: "",
      buttonText: "Submit",
    });
  
    const { email, password, buttonText } = userData;
  
    function handleChange(name, event) {
      setUserData({ ...userData, [name]: event.target.value });
    }
  
    function clickSubmit(event) {
      event.preventDefault();
      setUserData({ ...userData, buttonText: "Submitting" });
      axios({
        method: "POST",
        url: `http://localhost:8000/api/signin`,
        data: { email, password },
      })
        .then(function (response) {
          console.log("SIGNUP SUCCESS", response);
          // save response and token to local storage/cookie
          authenticate(response, () => {
            setUserData({
              ...userData,
              email: "",
              password: "",
              buttonText: "Submitted",
            });
            // Redirect user based on role after successful signin
            if (isAuth() && isAuth().role === "admin") {
              navigate("/admin", { replace: true });
            } else {
              navigate("/user", { replace: true });
            }
          });
        })
        .catch(function (error) {
          console.log("SIGNIN ERROR", error.response.data);
          setUserData({ ...userData,password: "", buttonText: "Submit" });
          toast.error(error.response.data.error);
        });
    }

	return (
        <div>
            <Toaster richColors position="top-right" expand='true' />
            {isAuth() ? <Navigate to="/admin"/> : null}
            <div className={styles.login_container}>
			<div className={styles.login_form_container}>
				<div className={styles.left}>
					<form className={styles.form_container}>
						<h1>Login to Your Account</h1>
						<input
							type="email"
							placeholder="Email"
							name="email"
							required
							className={styles.input}
              onChange={(e) => handleChange("email", e)}
              value={email}
						/>
						<input
							type="password"
							placeholder="Password"
							name="password"
							required
							className={styles.input}
              onChange={(e) => handleChange("password", e)}
              value={password}
						/>
						<button className={styles.green_btn} onClick={clickSubmit}>
							{buttonText}
						</button>
					</form>
					<Link to="/auth/password/forgot" className={styles.forgot_password}>
						Forgot Password?
					</Link>
				</div>
				<div className={styles.right}>
					<h1>New Here ?</h1>
					<Link to="/signup">
						<button type="button" className={styles.white_btn}>
							Sign Up
						</button>
					</Link>
				</div>
			</div>
		</div>
        </div>

	);
};

export default Login;
