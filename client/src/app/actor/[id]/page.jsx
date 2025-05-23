"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getApi } from "../../../services";
import CommonFormData from "../../../component/CommonFormData";

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
        <CommonFormData data={actorData} isActor={true}/>
    );
}
