"use client";
import React from 'react';
import Link from "next/link";

export default function CommonFormData(props) {
    const { data } = props;

    return (
        <div>
            <div className="mx-6"><b>About {data?.name}</b></div>
            <br />
            <div className="card mx-6">
                <div className="m-0 d-flex align-items-center gap_10">
                    <div className="m-0 w-25"><b>DOB: </b></div>
                    <div className="m-0">{data?.dob}</div>
                </div>
                <div className="m-0 d-flex align-items-center gap_10">
                    <div className="m-0 w-25"><b>BIO: </b></div>
                    <div className="m-0">{data?.bio}</div>
                </div>
                <div className="m-0 d-flex align-items-center gap_10">
                    <div className="m-0 w-25"><b>Gender: </b></div>
                    <div className="m-0">{data?.gender?.name}</div>
                </div>
            </div>
            <br />
            <Link href="/movies/list" className="mx-6">
                <button className="button">Go to list</button>
            </Link>
        </div>
    )
}
