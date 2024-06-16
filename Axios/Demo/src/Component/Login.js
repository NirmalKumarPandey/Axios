import React, { useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {

    let emailInputRef = useRef();
    let passwordInputRef = useRef();
    let dispatch = useDispatch();

    let navigate = useNavigate();


    let validateToken = async () => {
        let dataToSend = new FormData();
        dataToSend.append("token", localStorage.getItem("token"));

        let reqOption = {
            method: "POST",
            body: dataToSend,
        }
        let JSONData = await fetch("http://localhost:4567/validateToken", reqOption);
        let JSOData = await JSONData.json();
        console.log(JSOData);
        // Copy this code...................

        if (JSOData.status === "success") {
            dispatch({ type: "login", data: JSOData.data });
            navigate("/dashboard");
        }
        else {
            alert(JSOData.msg);
        }
    }

    let validateLogin = async () => {
        try {
            let dataToSend = new FormData();
            dataToSend.append("email", emailInputRef.current.value);
            dataToSend.append("password", passwordInputRef.current.value);
            let response = await axios.post("http://localhost:4567/login", dataToSend);
            console.log(response);
            if (response.data.status === "success") {
                localStorage.setItem("token", response.data.data.token);
                dispatch({ type: "login", data: response.data.data });
                navigate("/dashboard");
            } else {
                alert(response.data.msg);
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('Network Error');
        }

    }
    useEffect(() => {
        // Auto login work properly.....
        axios.defaults.baseURL = 'https://localhost:4567';
        //  emailInputRef.current.value = localStorage.getItem("email");
        //  passwordInputRef.current.value = localStorage.getItem("password");
        //  validateLogin();

        // I wanted to send token , when token exist and 
        // When we send this token Server recieve this token.
        //After That , You sholud Decript it.
        // Create a Token validate........
        if (localStorage.getItem("token")) {
            //      validateToken();
            axios.defaults.headers.common['Authorization'] = localStorage.getItem("token");
        }

    }, []);


    return (
        <div className='App'>
            <form>
                <h2>Login Page</h2>

                <div>
                    <label>Email</label>
                    <input ref={emailInputRef}></input>
                </div>
                <div>
                    <label>Password</label>
                    <input ref={passwordInputRef}></input>
                </div>

                <div>
                    <button type='button' onClick={() => validateLogin()}>Login</button>
                </div>

            </form>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <Link to="/signup">Signup</Link>
        </div>
    )
}

export default Login