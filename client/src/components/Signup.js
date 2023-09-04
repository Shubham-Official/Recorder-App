import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    //sending data to server
    const handleClick = async (e) => {
        e.preventDefault();
        const { name, email, password } = user;

        //server call
        const data = await fetch("http://localhost:8000/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
            })
        });

        const dataJson = await data.json();

        if (dataJson.error || !data) {
            window.alert(dataJson.error);
        } else {
            window.alert("User Registered Successfully");
            navigate("/login"); //After successful signup redirecting user to login component.
        }
    }

    return (
        <div className='card'>
            <div>
                <h1>Register</h1>
            </div>
            <form className='login-form' method='POST'>
                <div className='form-control'>
                    <label htmlFor="name">Name</label>
                    <input type="rext" name='name' id='name' value={user.name} placeholder='Enter Name' onChange={handleChange} />
                </div>
                <div className='form-control'>
                    <label htmlFor="email">Email</label>
                    <input type="email" name='email' id='email' value={user.email} placeholder='Enter Email' onChange={handleChange} />
                </div>
                <div className='form-control'>
                    <label htmlFor="password">Password</label>
                    <input type="password" name='password' id='password' value={user.password} placeholder='Enter Password' onChange={handleChange} />
                </div>
                <div>
                    <button className='btn submit-btn' type='submit' name='signup' value="signup" onClick={handleClick}>Signup</button>
                </div>
            </form>
        </div>
    )
}

export default Signup