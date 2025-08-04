import React, { useState, useEffect } from 'react';
import { useForm } from '../../../hooks/useForm';
import './RegisterForm.css';
import logoBlack from '../../../assets/logoblack.svg'


export default function RegisterForm({ onSubmit, navigateToRegister, isLoadingText }){

    const { values, handleChange } = useForm({
        name: '',
        email: '',
        password: ''
    });

    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        const isFormValid = values.name && values.email && values.password;
        setIsButtonDisabled(!isFormValid)
    }, [values]);


    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(values);
    }
    return (
        <form className='register-form' onSubmit={handleSubmit}>
            <img src={logoBlack} alt='Logo' className="register-form__logo" />
            <div className="register-form__content">
                <h2 className="register-form__title">Log in to <span className="register-form__title-span">ScoreSync</span></h2>
                <label htmlFor="email" className="login-form__label">
                    Name
                    <input 
                        type="name"
                        name='name' 
                        className="register-form__input" 
                        placeholder='Name'
                        required
                        value={values.name}
                        onChange={handleChange}
                        id='name'
                    />
                </label>
                <label htmlFor="email" className="login-form__label">
                    Email
                    <input 
                        type="email"
                        name='email' 
                        className="register-form__input" 
                        placeholder='Email'
                        required
                        value={values.email}
                        onChange={handleChange}
                        id='email'
                    />
                </label>
                <label htmlFor="password" className="register-form__label">
                    Password
                    <input 
                        type="password" 
                        className="register-form__input" 
                        placeholder='Password'
                        required
                        value={values.password}
                        onChange={handleChange}
                        id='password'        
                    />
                </label>
                <div className="register-form__button-container">
                    <button
                        type='submit'
                        className={`register-form__link ${isButtonDisabled ? "register-form__link_disabled" : ''}`}
                        disabled={isButtonDisabled}
                    >
                        Login
                    </button>
                    <button
                        type='button'
                        className='register-form__register-link'
                        onClick={navigateToRegister}
                    >
                        or Register
                    </button>
                </div>
            </div>
        </form>
    )
}