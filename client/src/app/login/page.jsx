
"use client"
import { useState, useEffect } from 'react';
import { postApi } from '../../services';
import { useRouter } from "next/navigation"
import Toast from '../../component/Toast';
import Link from 'next/link';


export default function Login() {
    const router = useRouter()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        const userToken = localStorage.getItem("userToken");
        if (userToken) {
            router.push("/movies/list")
        }
    }, [])


    const handleLogin = async (e) => {
        e.preventDefault();
        await postApi("/api/auth/login", { email, password }, false).then(data => {
            localStorage.setItem('userToken', data?.token)
            router.push("/movies/list")
        }).catch((err) => {
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false)
            }, 3000)
            setToastMessage(<div className="errorBg  p-3">{err.error}</div>)
        })
    };

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">Login</h3>
                            <form onSubmit={handleLogin}>
                                {/* Email Input */}
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Password Input */}
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">
                                    Login
                                </button>
                            </form>
                        </div>
                <div className="alignRight">
                    Don't have an account? <Link href="/signup">Sign Up</Link> here
                </div>
                    </div>
                </div>
            </div>
            <Toast showToast={showToast} message={toastMessage} />
        </div>
    );
}
