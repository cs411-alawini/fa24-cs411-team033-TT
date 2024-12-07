// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './styles/Login.css';

// function Login() {
//     const [Email, setEmail] = useState('');
//     const [Password, setPassword] = useState('');
//     // const [newEmail, setNewEmail] = useState('');
//     // const [newPassword, setNewPassword] = useState('');
//     // const [firstName, setFirstName] = useState('');
//     // const [lastName, setLastName] = useState('');
//     // const [phoneNumber, setPhoneNumber] = useState('');
//     const navigate = useNavigate();

//     const handleLogin = () => {
//         axios({
//             method: 'POST',
//             url: 'http://127.0.0.1:5050/api/login',
//             data: {
//                 Email: Email,
//                 Password: Password
//             }
//         })
//         .then((response) => {
//             console.log('Login successful:', response.data);
//             if (response.status === 200) {
//                 localStorage.setItem("Email", response.data.email);
//                 localStorage.setItem("UserId", response.data.id);
//                 // navigate('/closet');
//                 navigate(`/closet/?UserId=${response.data.id}`);
//             } else {
//                 alert("Wrong Password. Please try again.");
//             }
//         })
//         .catch((error) => {
//             if (error.response) {
//                 console.log('Login error:', error.response.data);
//             } else {
//                 console.log('Error:', error.message);
//             }
//         });
//     };

//     return (
//         <div className='inner'>
//             <style>@import url('https://fonts.googleapis.com/css2?family=Forum&family=Inter:wght@900&display=swap');</style>
//             <h2>Welcome</h2>
//             <form onSubmit={(e) => {
//                 e.preventDefault();
//                 handleLogin();
//             }}>
//                 <input
//                     type="text"
//                     placeholder="Email"
//                     value={Email}
//                     onChange={e => setEmail(e.target.value)}
//                 />
//                 <input
//                     type="password"
//                     placeholder="Password"
//                     value={Password}
//                     onChange={e => setPassword(e.target.value)}
//                 />
//                 <button type="submit">Login</button>
//             </form>

//             <p>Don't have an account?</p>
//             <button type="button" className="signup-button" onClick={() => navigate('/register')}>
//                 Sign-Up
//             </button>
//         </div>
//     );
// }

// export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Login.css';

function Login() {
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
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
                    navigate(`/closet/?UserId=${response.data.id}`);
                }
            })
            .catch((error) => {
                if (error.response) {
                    const { message } = error.response.data;
                    if (message === "Invalid email") {
                        setErrorMessage("Invalid email. Please try again.");
                    } else if (message === "Wrong password") {
                        setErrorMessage("Wrong password. Please try again.");
                    } else {
                        setErrorMessage("An unexpected error occurred. Please try again.");
                    }
                } else {
                    setErrorMessage("Error connecting to the server. Please try again.");
                }
            });
    };

    return (
        <div className='inner'>
            <style>@import url('https://fonts.googleapis.com/css2?family=Forum&family=Inter:wght@900&display=swap');</style>
            <h2>Welcome</h2>
            <form onSubmit={(e) => {
                e.preventDefault();
                setErrorMessage(''); 
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

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <p>Don't have an account?</p>
            <button type="button" className="signup-button" onClick={() => navigate('/register')}>
                Sign-Up
            </button>
        </div>
    );
}

export default Login;
