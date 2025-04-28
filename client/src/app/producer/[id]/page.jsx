"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getApi } from "../../../services";
import CommonFormData from "../../../component/CommonFormData";

export default function Actor() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [producerData, setProducerData] = useState({});
    const [isErrorOccured, setIsErrorOccured] = useState({});
    useEffect(() => {
        const getProducerData = async () => {
            setLoading(true);
            await getApi(`/api/producers/${id}`)
                .then((data) => {
                    setProducerData(data);
                    setIsErrorOccured(false);
                })
                .catch(() => setIsErrorOccured(true))
                .finally(() => {
                    setLoading(false);
                });
        };
        getProducerData();
    }, [id]);

    if (loading) {
        return <>Loading ...</>;
    }
    if (isErrorOccured) {
        return <>Error occurred wile fetching the data for actor id: {id}</>;
    }
    return (
        <CommonFormData data={producerData} isActor={false} />
    );
}
