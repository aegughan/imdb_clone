"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getApi } from "../../../services";
import Link from "next/link";

export default function Actor() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [actorData, setActorData] = useState({});
    const [isErrorOccured, setIsErrorOccured] = useState({});
    useEffect(() => {
        const getActorData = async () => {
            setLoading(true);
            await getApi(`/api/actors/${id}`)
                .then((data) => {
                    setActorData(data);
                    setIsErrorOccured(false);
                })
                .catch(() => setIsErrorOccured(true))
                .finally(() => {
                    setLoading(false);
                });
        };
        getActorData();
    }, [id]);

    if (loading) {
        return <>Loading ...</>;
    }
    if (isErrorOccured) {
        return <>Error occurred wile fetching the data for actor id: {id}</>;
    }
    return (
        <div>
            <div className="mx-6"><b>About {actorData?.name}</b></div>
            <br />
            <div className="card mx-6">
                <div className="m-0 d-flex align-items-center gap_10">
                    <div className="m-0 w-25"><b>DOB: </b></div>
                    <div className="m-0">{actorData?.dob}</div>
                </div>
                <div className="m-0 d-flex align-items-center gap_10">
                    <div className="m-0 w-25"><b>BIO: </b></div>
                    <div className="m-0">{actorData?.bio}</div>
                </div>
                <div className="m-0 d-flex align-items-center gap_10">
                    <div className="m-0 w-25"><b>Gender: </b></div>
                    <div className="m-0">{actorData?.gender?.name}</div>
                </div>
            </div>
            <br />
            <Link href="/movies/list" className="mx-6">
                <button className="button">Go to list</button>
            </Link>
        </div>
    );
}
