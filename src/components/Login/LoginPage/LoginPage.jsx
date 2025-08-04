import React from 'react';

import './LoginPage.css'
import LoginForm from '../LoginForm/LoginForm';

import LoginImage from '../../../assets/LoginImage.svg';

export default function LoginPage() {
    return(

        <div className="login-page">
            <img src={LoginImage} alt="Login Image" className="login-page__image" />
            <div className="login-page__overlay">
                <form className="login__form-card">
                    <LoginForm />
                </form>
            </div>
        </div>
    )
}