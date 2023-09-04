import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    const handleClick = async (e) => {
        e.preventDefault();

        const { email, password } = user;

        const data = await fetch("http://localhost:8000/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        const dataJson = await data.json();

        if (dataJson.error || !data || !dataJson.user) {
            window.alert("Invalid Credentials!");
        } else {
            localStorage.setItem("token", dataJson.user);
            window.alert("Login Successful");
            navigate("/home");
        }
    }

    return (
        <div className='card'>
            <div>
                <h1>Login</h1>
            </div>
            <form className='login-form' method='POST'>
                <div className='form-control'>
                    <label htmlFor="email">Email</label>
                    <input type="email" name='email' id='email' value={user.email} placeholder='Enter Email' onChange={handleChange} />
                </div>
                <div className='form-control'>
                    <label htmlFor="password">Password</label>
                    <input type="password" name='password' id='password' value={user.password} placeholder='Enter Password' onChange={handleChange} />
                </div>
                <div>
                    <button className='btn submit-btn' type='submit' name='signin' value="signin" onClick={handleClick}>Log In</button>
                </div>
            </form>
        </div>
    )
}

export default Login