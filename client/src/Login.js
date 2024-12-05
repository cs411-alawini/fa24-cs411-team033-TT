import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Login.css';

function Login() {
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        axios({
            method: 'POST',
            url: 'http://127.0.0.1:5050/api/login',
            data: {
                Email: Email,
                Password: Password
            }
        })
        .then((response) => {
            console.log('Login successful:', response.data);
            if (response.status === 200) {
                localStorage.setItem("Email", response.data.email);
                localStorage.setItem("UserId", response.data.id);
                // navigate('/closet');
                navigate(`/closet/?UserId=${response.data.id}`);
            } else {
                alert("Wrong Password. Please try again.");
            }
        })
        .catch((error) => {
            if (error.response) {
                console.log('Login error:', error.response.data);
            } else {
                console.log('Error:', error.message);
            }
        });
    };

    return (
        <div className='inner'>
            <style>@import url('https://fonts.googleapis.com/css2?family=Forum&family=Inter:wght@900&display=swap');</style>
            <h2>Welcome</h2>
            <form onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
            }}>
                <input
                    type="text"
                    placeholder="Email"
                    value={Email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={Password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>

            <p>Don't have an account?</p>
            <button type="button" className="signup-button" onClick={() => navigate('/register')}>
                Sign-Up
            </button>
        </div>
    );
}

export default Login;