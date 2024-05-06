import React, { useState } from "react";
import styles from "../styles/Forgot.module.css";
import axios from 'axios';
import { Toaster, toast } from 'sonner';

// Component for handling forgot password functionality
const Forgot = () => {
    // State to manage form values and button text
    const [values, setValues] = useState({
        email: '',
        buttonText: 'Request password reset link'
    });

    // Destructuring state values
    const { email, buttonText } = values;

    // Function to handle input change
    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    };

    // Function to handle form submission
    const clickSubmit = async event => {
        event.preventDefault();
        setValues({ ...values, buttonText: 'Requesting..' });
        try {
            const response = await axios.put(`http://localhost:8000/api/forgot-password`, { email });
            console.log('FORGOT PASSWORD SUCCESS', response);
            toast.success(response.data.message);
            setValues({ ...values, email: '', buttonText: 'Request password reset link' });
        } catch (error) {
            console.log('FORGOT PASSWORD ERROR', error.response.data);
            toast.error(error.response.data.error);
            setValues({ ...values, buttonText: 'Request password reset link' });
        }
    };

    // Rendering the forgot password form
    return (
        <div>
            <Toaster richColors position="top-right" expand='true' />
            <div className={styles.forgot_container}>
                <div className={styles.forgot_form_container}>
                    <h1>Forgot Your Password?</h1>
                    <p>Please enter your registered email address below and we'll send you a link to reset your password.</p>
                    <form className={styles.form_container}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            name="email"
                            className={styles.input}
                            onChange={handleChange('email')}
                            value={email}
                            required
                        />
                        <button type="submit" className={styles.green_btn} onClick={clickSubmit}>
                            {buttonText}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Forgot;
