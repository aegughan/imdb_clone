
"use client"
import { useState, useEffect } from 'react';
import { postApi } from '../../services';
import { useRouter } from "next/navigation"
import Toast from '../../component/Toast';
import Link from 'next/link';


export default function Signup() {
    const router = useRouter()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [timer, setTimer] = useState(5);

    const successToastMessage = () => {
        return <div className="successBg  p-3">{`Sign-up successful! Welcome:)`}
            <br />
            {`You will be redirected to login page in ${timer} seconds:)`}</div>
    }

    const handleSignup = async (e) => {
        e.preventDefault();
        await postApi("/api/auth/signup", { email, password }, false).then(data => {
            setToastMessage(successToastMessage())
            setShowToast(true);
            setSignupSuccess(true)
            setTimeout(() => {
                setShowToast(false)
                router.push("/login")
            }, 5000)
        }).catch((err) => {
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false)
            }, 5000)
            setToastMessage(<div className="errorBg  p-3">{err.error}</div>)
        })
    };

    useEffect(() => {
        if (showToast && signupSuccess) {
            const interval = setInterval(() => {
                setTimer(prevSeconds => prevSeconds - 1);
            }, 1000);
            return () => {
                clearInterval(interval)
            }
        }
    }, [showToast, signupSuccess])

    useEffect(() => {
        setToastMessage(successToastMessage())
    }, [timer])



    return (
        <>
            <div className="container my-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow">
                            <div className="card-body">
                                <h3 className="card-title text-center mb-4">Sign Up</h3>
                                <form onSubmit={handleSignup}>
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

                                    {/* Submit Button */}
                                    <button type="submit" className="btn btn-primary w-100">
                                        Sign Up
                                    </button>
                                </form>
                            </div>
                            <div className="alignRight mx-3">
                                Already have an account? <Link href="/login">Login</Link> here
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toast showToast={showToast} message={toastMessage} />
        </>);
}
