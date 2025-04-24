"use client";

import React, { useEffect } from "react";

const Page = () => {
  useEffect(() => {
    fetch("http://localhost:8080/api/home")
      .then((res) => res.json())
      .then(() => {});
  }, []);
  return <div>page</div>;
};

export default Page;
