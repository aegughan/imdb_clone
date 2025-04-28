"use client";
import React from 'react'
import Header from '../Header'
import { usePathname } from 'next/navigation';


export default function Layout(props) {
    const { children } = props
    const pathname = usePathname();
    return (
        <>
            {!(pathname?.includes("/login") || pathname?.includes("/signup")) && <Header />}
            {children}
        </>
    )
}
