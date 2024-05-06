import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import styles from "../styles/Signup.module.css";
import axios from "axios";
import { Toaster, toast } from 'sonner'
import { isAuth } from "./Helpers";

const Signup = () => {
    // State for user data and button text
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        buttonText: "Sign up"
    });

    const { name, email, phone, password, confirmPassword, buttonText } = userData;

    // Function to handle input change
    function handleChange(name, event) {
        setUserData({ ...userData, [name]: event.target.value });
    }

    // Function to handle form submission
    function clickSubmit(event) {
        event.preventDefault();

        // Check if passwords match
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        // Update button text to show submission is in progress
        setUserData({ ...userData, buttonText: "Signing up..." });

        // Send signup request to server
        axios({
            method: "POST",
            url: `http://localhost:8000/api/signup`,
            data: { name, email, phone, password }
        })
            .then(function (response) {
                console.log("SIGNUP SUCCESS", response);
                // Reset form values and button text
                setUserData({
                    ...userData,
                    name: "",
                    email: "",
                    phone: "",
                    password: "",
                    confirmPassword: "",
                    buttonText: "Sign up"
                });
                toast.success(response.data.message);
            })
            .catch(function (error) {
                console.log("SIGNUP ERROR", error.response.data);
                // Reset button text in case of error
                setUserData({ ...userData, buttonText: "Sign up" });
                toast.error(error.response.data.error);
            });
    }

    return (
        <div>
            <Toaster richColors position="top-right" expand='true' />
            {/* Redirect to admin dashboard if already authenticated */}
            {isAuth() ? <Navigate to="/admin" /> : null}
            <div className={styles.signup_container}>
                <div className={styles.signup_form_container}>
                    <div className={styles.left}>
                        <h1>Welcome Back</h1>
                        <Link to="/signin">
                            <button type="button" className={styles.white_btn}>
                                Login
                            </button>
                        </Link>
                    </div>
                    <div className={styles.right}>
                        <form className={styles.form_container}>
                            <h1>Create Account</h1>
                            <input
                                type="text"
                                placeholder="Name"
                                name="name"
                                onChange={(e) => handleChange("name", e)}
                                value={name}
                                required
                                className={styles.input}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                name="email"
                                onChange={(e) => handleChange("email", e)}
                                value={email}
                                required
                                className={styles.input}
                            />
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                name="phone"
                                onChange={(e) => handleChange("phone", e)}
                                value={phone}
                                required
                                className={styles.input}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                name="password"
                                onChange={(e) => handleChange("password", e)}
                                value={password}
                                required
                                className={styles.input}
                            />
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                name="confirmPassword"
                                onChange={(e) => handleChange("confirmPassword", e)}
                                value={confirmPassword}
                                required
                                className={styles.input}
                            />
                            <button className={styles.green_btn} onClick={clickSubmit}>
                                {buttonText}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
