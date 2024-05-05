import styles from "../styles/Activate.module.css";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import axios from "axios";
import { Toaster, toast } from 'sonner'
const Activate = () => {
    const [userData, setUserData] = useState({
        name: "",
        token: "",
        show: true,
    });

    const { token } = useParams();

    useEffect(() => {
        if (token) {
            const decodedToken = decodeToken(token);
            const { name } = decodedToken;

            setUserData({ ...userData, token, name });
        }
    }, [token]);

    const { name } = userData;


    function clickSubmit(event) {
        event.preventDefault();
        axios({
            method: "POST",
            url: `http://localhost:8000/api/account-activation`,
            data: {token}
        })
        .then(function(response) {
            console.log("ACCOUNT ACTIVATION SUCCESS", response);
            setUserData({...userData, show: false});
            toast.success(response.data.message);
        })
        .catch(function(error) {
            console.log("ACCOUNT ACTIVATION ERROR", error.response.data.error);
            toast.error(error.response.data.error);
        });
    };

    
    // Function to decode the JWT token
    function decodeToken(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error decoding token:', error);
            return {};
        }
    }

    return (
        <div>
            <Toaster richColors position="top-right" />
            <div className={styles.activate_container}>
                <div className={styles.activate_content}>
                    <h1>Welcome to Our Platform!</h1>
                    <p>Hii.. {name}. Thank you for registering with us. Please activate your account to start exploring.</p>
                    <button className={styles.green_btn} onClick={clickSubmit}>Activate Account</button>
                </div>
            </div>
        </div>

    );
};

export default Activate;
