import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login(props) {
    const [credentials, setCredentials] = useState({ email: "", password: "" })
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
        });
        const json = await response.json();
        console.log(json);
        if (json.success) {
            // redirect Home Page
            localStorage.setItem('token', json.authToken)
            navigate('/');
            props.showAlert("Login Successfully", "success")
        } else {
            props.showAlert("Invalid Credentials", "danger")
        }

    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    return (
        <div>
            <h2 className='text-center my-3'>Login with your Cloudy Notes credential</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" value={credentials.email} onChange={onChange} />

                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" value={credentials.password} onChange={onChange} />
                </div>
                <button type="submit" className="btn btn-primary" >Submit</button>
            </form>
        </div>
    )
}

export default Login