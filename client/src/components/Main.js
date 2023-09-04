import React from 'react';
import { Link } from "react-router-dom";

const Main = () => {
    return (
        <div className='main'>
            <div class="main-container" >
                <div class="login bg-light">
                    <h3>Existing User</h3>
                    <Link to="/login"><button class="btn">Login</button></Link></div>
                <div class="login bg-light">
                    <h3>New User</h3>
                    <Link to="/signup"><button class="btn">Signup</button></Link></div>
            </div >
        </div>
    )
}

export default Main