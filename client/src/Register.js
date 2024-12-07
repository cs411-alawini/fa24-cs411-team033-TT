// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './styles/Login.css';

// function Register() {
//     const [Email, setEmail] = useState('');
//     const [Password, setPassword] = useState('');
//     const [newEmail, setNewEmail] = useState('');
//     const [newPassword, setNewPassword] = useState('');
//     const [firstName, setFirstName] = useState('');
//     const [lastName, setLastName] = useState('');
//     const [phoneNumber, setPhoneNumber] = useState('');
//     const navigate = useNavigate();


//     const handleRegister = () => {
//         axios({
//             method: 'POST',
//             url: 'http://127.0.0.1:5050/api/register',
//             data: {
//                 Email: newEmail,
//                 Password: newPassword,
//                 FirstName: firstName,
//                 LastName: lastName,
//                 PhoneNumber: phoneNumber
//             }
//         })
//         .then((response) => {
//             if (response.data === "Already Exists") {
//                 alert("Email Already Exists, Please Try a Different Email ID!");
//             } else if (response.data === "Not a Valid Email") {
//                 alert("Not a Valid Email");
//             } else {
//                 localStorage.setItem("Email", response.data.email);
//                 localStorage.setItem("UserId", response.data.id);
//                 console.log(response.data);
//                 alert("Registration Successful. Please Login.");
//                 navigate('/');
//             }
//             console.log('Registration successful:', response.data);
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
//             <h2>Register</h2>
//             <form onSubmit={(e) => {
//                 e.preventDefault();
//                 handleRegister();
//             }}>
//                 <input
//                     type="text"
//                     placeholder="First Name"
//                     value={firstName}
//                     onChange={e => setFirstName(e.target.value)}
//                 />
//                 <input
//                     type="text"
//                     placeholder="Last Name"
//                     value={lastName}
//                     onChange={e => setLastName(e.target.value)}
//                 />
//                 <input
//                     type="text"
//                     placeholder="Phone Number"
//                     value={phoneNumber}
//                     onChange={e => setPhoneNumber(e.target.value)}
//                 />
//                 <input
//                     type="text"
//                     placeholder="Email"
//                     value={newEmail}
//                     onChange={e => setNewEmail(e.target.value)}
//                 />
//                 <input
//                     type="password"
//                     placeholder="Password"
//                     value={newPassword}
//                     onChange={e => setNewPassword(e.target.value)}
//                 />
//                 <button type="submit">Submit</button>
//             </form>
//         </div>
//     );
// }

// export default Register;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Login.css';

function Register() {
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = () => {
        setErrorMessage(''); 
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
            if (response.status === 201) {
                alert("Registration Successful. Please Login.");
                navigate('/');
            }
        })
        .catch((error) => {
            if (error.response) {
                const { message } = error.response.data;
                if (message === "Email already exists") {
                    setErrorMessage("This email is already registered. Please try a different email.");
                } else if (message === "Missing parameters") {
                    setErrorMessage("Please fill out all required fields.");
                } else {
                    setErrorMessage("An unexpected error occurred. Please try again.");
                }
                console.error('Registration error:', error.response.data);
            } else {
                setErrorMessage("Error connecting to the server. Please try again.");
                console.error('Error:', error.message);
            }
        });
    };

    return (
        <div className='inner'>
            <style>@import url('https://fonts.googleapis.com/css2?family=Forum&family=Inter:wght@900&display=swap');</style>
            <h2>Register</h2>
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
                    placeholder="Email"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                />
                <button type="submit">Submit</button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
}

export default Register;

