"use client";
import React from 'react'
import { useRouter } from "next/navigation"


export default function Header() {
    const router = useRouter()
    const logoutUser = () => {
        localStorage.removeItem("userToken")
        router.push("/login")
    }
    return (
        <>
            <div className="flexRow space-between align-center">
                <div>Welcome to IMDB !</div>
                <button className="button" onClick={logoutUser}>Logout</button>
            </div>
            <hr />
        </>
    )
}
