import React from 'react';

import './LoginPage.css'
import LoginForm from '../LoginForm/LoginForm';

import LoginImage from '../../../assets/LoginImage.svg';

export default function LoginPage() {
    const handleLogin = (values) => {
        // Call API
    }

    const navigagteRegister = () => {
        // Navigate to register
    }

    return(

        <div className="login-page">
            <img src={LoginImage} alt="Login Image" className="login-page__image" />
            <div className="login-page__overlay">
                <div className="login__form-card">
                    <LoginForm onSubmit={handleLogin} navigateToRegister={navigagteRegister}/>
                </div>
            </div>
        </div>
    )
}