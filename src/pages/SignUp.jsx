import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import OAuth from '../components/OAuth';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';

function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: '',
    });
    const { name, email, password, password2 } = formData;

    const navigate = useNavigate();

    const onChange = (e) =>
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));

    const onSubmit = async (e) => {
        e.preventDefault();

        if (name === '') {
            toast.error('Please enter your name.');
        } else if (email === '') {
            toast.error('Please enter your email.');
        } else if (password === '') {
            toast.error('Please enter your password.');
        } else if (password !== password2) {
            toast.error('Passwords do not match.');
        } else if (password.length < 6) {
            toast.error('Password is too short.');
        } else {
            try {
                const auth = getAuth();

                const userCredential = await createUserWithEmailAndPassword(auth, email, password);

                const { user } = userCredential;

                await updateProfile(auth.currentUser, {
                    displayName: name,
                });

                // add User to DB
                const formDataCopy = { ...formData };
                delete formDataCopy.password;
                delete formDataCopy.password2;

                formDataCopy.timestamp = serverTimestamp();

                await setDoc(doc(db, 'users', user.uid), formDataCopy);

                navigate('/');
            } catch (error) {
                if (error.message === 'Firebase: Error (auth/email-already-in-use).') {
                    toast.error('User is already registered.');
                } else {
                    toast.error(error.message);
                }
            }
        }
    };

    return (
        <>
            <div className="pageContainer">
                <header>
                    <p className="pageHeader">Register</p>
                </header>
                <main>
                    <form onSubmit={onSubmit}>
                        <input
                            type="text"
                            className="nameInput"
                            placeholder="Enter your name."
                            name="name"
                            value={name}
                            onChange={onChange}
                        />
                        <input
                            type="email"
                            className="emailInput"
                            placeholder="Enter your email address."
                            name="email"
                            value={email}
                            onChange={onChange}
                            autoComplete="username"
                        />

                        <div className="passwordInputDiv">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="passwordInput"
                                placeholder="Enter your password."
                                name="password"
                                value={password}
                                onChange={onChange}
                                autoComplete="new-password"
                            />

                            <img
                                src={visibilityIcon}
                                alt="show password"
                                className="showPassword"
                                onClick={() => setShowPassword((prevState) => !prevState)}
                            />
                        </div>

                        <div className="passwordInputDiv">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="passwordInput"
                                placeholder="Repeat your password."
                                name="password2"
                                value={password2}
                                onChange={onChange}
                                autoComplete="new-password"
                            />

                            <img
                                src={visibilityIcon}
                                alt="show password"
                                className="showPassword"
                                onClick={() => setShowPassword((prevState) => !prevState)}
                            />
                        </div>

                        <div className="signUpBar">
                            <p className="signUpText">Sign Up</p>
                            <button className="signUpButton">
                                <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
                            </button>
                        </div>
                    </form>

                    <OAuth />

                    <Link to="/sign-in" className="registerLink">
                        Sign In Instead
                    </Link>
                </main>
            </div>
        </>
    );
}

export default SignUp;
