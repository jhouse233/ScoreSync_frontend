import React, { useState, useEffect } from 'react';
import { useForm } from '../../../hooks/useForm';
import './LoginForm.css';
import logoBlack from '../../../assets/logoblack.svg'


export default function LoginForm({ onSubmit, navigateToRegister, isLoadingText }){

    const { values, handleChange } = useForm({
        email: '',
        password: ''
    });

    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        const isFormValid = values.email && values.password;
        setIsButtonDisabled(!isFormValid)
    }, [values]);


    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(values);
    }
    return (
        <form className='login-form' onSubmit={handleSubmit}>
            <img src={logoBlack} alt='Logo' className="login-form__logo" />
            <div className="login-form__content">
                <h2 className="login-form__title">Log in to <span className="login-form__title-span">ScoreSync</span></h2>
                <label htmlFor="email" className="login-form__label">
                    Email
                    <input 
                        type="email"
                        name='email' 
                        className="login-form__input" 
                        placeholder='Email'
                        required
                        value={values.email}
                        onChange={handleChange}
                        id='email'
                    />
                </label>
                <label htmlFor="password" className="login-form__label">
                    Password
                    <input 
                        type="password" 
                        className="login-form__input" 
                        placeholder='Password'
                        required
                        value={values.password}
                        onChange={handleChange}
                        id='password'        
                    />
                </label>
                <div className="login-form__button-container">
                    <button
                        type='submit'
                        className={`login-form__link ${isButtonDisabled ? "login-form__link_disabled" : ''}`}
                        disabled={isButtonDisabled}
                    >
                        Login
                    </button>
                    <button
                        type='button'
                        className='login-form__register-link'
                        onClick={navigateToRegister}
                    >
                        or Register
                    </button>
                </div>
            </div>
        </form>
    )
}
