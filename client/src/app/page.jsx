"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation"

const Page = () => {
    const router = useRouter()
    useEffect(() => {
        router.push("/movies/list")
    }, []);
    return <div>Home page</div>;
};

export default Page;
