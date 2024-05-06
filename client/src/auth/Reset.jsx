import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from "../styles/Reset.module.css";
import axios from 'axios';
import { Toaster, toast } from 'sonner';

const Reset = () => {
    const navigate = useNavigate();
    const { token } = useParams();

    // State for form values and button text
    const [values, setValues] = useState({
        newPassword: '',
        confirmPassword: '',
        buttonText: 'Reset password'
    });

    useEffect(() => {
        if (token) {
            // Set token in state when component mounts
            setValues(prevValues => ({ ...prevValues, token }));
        }
    }, [token]);

    const { newPassword, confirmPassword, buttonText } = values;

    // Function to handle input change
    const handleChange = event => {
        const { name, value } = event.target;
        setValues({ ...values, [name]: value });
    };

    // Function to handle form submission
    const clickSubmit = async event => {
        event.preventDefault();
        
        if (newPassword === confirmPassword) {
            // Passwords match, submit the form or perform reset action
            console.log("Passwords match, submit the form or perform reset action");
        } else {
            toast.error("Passwords do not match.");
            return; // Exit function if passwords don't match
        }

        // Update button text to show submission is in progress
        setValues({ ...values, buttonText: 'Submitting' });

        try {
            // Send reset password request to server
            const response = await axios.put(`http://localhost:8000/api/reset-password`, {
                newPassword,
                resetPasswordLink: token
            });
            console.log('RESET PASSWORD SUCCESS', response);
            toast.success(response.data.message);
            // Reset form values and button text
            setValues({ ...values, newPassword: '', confirmPassword: '', buttonText: 'Reset Password' });
            // Redirect to login page after password reset
            navigate('/signin');
        } catch (error) {
            console.log('RESET PASSWORD ERROR', error.response.data);
            toast.error(error.response.data.error);
            // Reset button text in case of error
            setValues({ ...values, buttonText: 'Reset password' });
        }
    };

    return (
        <div>
            <Toaster richColors position='top-right' expand='true' />
            <div className={styles.reset_container}>
                <div className={styles.reset_content}>
                    <h1>Reset Your Password</h1>
                    <p>Please enter your new password below.</p>
                    <form className={styles.form_container}>
                        <input
                            type="password"
                            placeholder="New Password"
                            name="newPassword"
                            onChange={handleChange}
                            value={newPassword}
                            required
                            className={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handleChange}
                            required
                            className={styles.input}
                        />
                        <button onClick={clickSubmit} className={styles.green_btn}>
                            {buttonText}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Reset;
