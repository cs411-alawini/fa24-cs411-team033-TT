// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './Login.css'

// function Login() {
//     const [Email, setEmail] = useState('');
//     const [Password, setPassword] = useState('');
//     const [newEmail, setNewEmail] = useState('');
//     const [newPassword, setNewPassword] = useState('');
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
//             // console.log(response);
//             // console.log((response.data));
//             // Redirect to /home on successful login
//             if (response.status === 200){
//                 localStorage.setItem("Email", (response.data)["email"])
//                 localStorage.setItem("UserId", (response.data)["id"])
//                 navigate('/closet');
//             } else {
//                 alert("Wrong Password. Please try again.")
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

//     const handleRegister = () => {
//         axios({
//             method: 'POST',
//             url: 'http://127.0.0.1:5050/api/register',
//             data: {
//                 Email: newEmail,
//                 Password: newPassword
//             }
//         })
//         .then((response) => {
//             if (response.data === "Already Exists"){
//                 alert("Email Already Exists, Please Try a Different Email ID!")
//             } else if (response.data === "Not a Valid Email") {
//                 alert("Not a Valid Email")
//             }
//                 else {
//                     localStorage.setItem("Email", (response.data)["email"])
//                     localStorage.setItem("UserId", (response.data)["id"])
//                 console.log(response.data)
//                 alert("Registration Successful. Please Login.")
//             }
//             console.log('Registration successful:', response.data);
//             //alert("Registration successful. Please login.");
//         })
//         .catch((error) => {
//             if (error.response) {
//                 console.log('Registration error:', error.response.data);
//             } else {
//                 console.log('Error:', error.message);
//             }
//         });
//     };

//     return (
//         <div className='inner'>
//             <style>@import url('https://fonts.googleapis.com/css2?family=Forum&family=Inter:wght@900&display=swap');</style>
//             <h2>Login</h2>
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
//                     type="Password"
//                     placeholder="Password"
//                     value={Password}
//                     onChange={e => setPassword(e.target.value)}
//                 />
//                 <button type="submit">Login</button>
//             </form>
//             <h2>New User</h2>
//             <form onSubmit={(e) => {
//                 e.preventDefault();
//                 handleRegister();
//             }}>
//                 <input
//                     type="text"
//                     placeholder="New Email"
//                     value={newEmail}
//                     onChange={e => setNewEmail(e.target.value)}
//                 />
//                 <input
//                     type="Password"
//                     placeholder="New Password"
//                     value={newPassword}
//                     onChange={e => setNewPassword(e.target.value)}
//                 />
//                 <button type="submit">Register</button>
//             </form>
//         </div>
//     );
// }

// export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

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

    const handleRegister = () => {
        axios({
            method: 'POST',
            url: 'http://127.0.0.1:5050/api/register',
            data: {
                Email: newEmail,
                Password: newPassword,
                FirstName: firstName,
                LastName: lastName,
                PhoneNumber: phoneNumber
            }
        })
        .then((response) => {
            if (response.data === "Already Exists") {
                alert("Email Already Exists, Please Try a Different Email ID!");
            } else if (response.data === "Not a Valid Email") {
                alert("Not a Valid Email");
            } else {
                localStorage.setItem("Email", response.data.email);
                localStorage.setItem("UserId", response.data.id);
                console.log(response.data);
                alert("Registration Successful. Please Login.");
            }
            console.log('Registration successful:', response.data);
        })
        .catch((error) => {
            if (error.response) {
                console.log('Registration error:', error.response.data);
            } else {
                console.log('Error:', error.message);
            }
        });
    };

    return (
        <div className='inner'>
            <style>@import url('https://fonts.googleapis.com/css2?family=Forum&family=Inter:wght@900&display=swap');</style>
            <h2>Login</h2>
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
            <h2>New User</h2>
            <form onSubmit={(e) => {
                e.preventDefault();
                handleRegister();
            }}>
                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="New Email"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Login;
