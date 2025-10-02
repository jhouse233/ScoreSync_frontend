import React from 'react';

import './RegisterPage.css'
import RegisterForm from '../RegisterForm/RegisterForm';

import LoginImage from '../../../assets/LoginImage.svg';

export default function RegisterPage() {
    return(

        <div className="register-page">
            <img src={LoginImage} alt="Register Image" className="register-page__image" />
            <div className="register-page__overlay">
                <div className="register__form-card">
                    <RegisterForm />
                </div>
            </div>
        </div>
    )
}