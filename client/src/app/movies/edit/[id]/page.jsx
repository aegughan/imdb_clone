"use client";
import MovieForm from "../../../../component/MovieForm";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getApi } from "../../../../services";

export default function Edit() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [movieData, setMovieData] = useState({});
    const [isErrorOccured, setIsErrorOccured] = useState({});

    useEffect(() => {
        const getMovieData = async () => {
            setLoading(true);
            await getApi(`/api/movies/${id}`)
                .then((data) => {
                    setMovieData(data);
                    setIsErrorOccured(false);
                })
                .catch(() => setIsErrorOccured(true))
                .finally(() => {
                    setLoading(false);
                });
        };
        getMovieData();
    }, [id]);

    if (loading) {
        return <>Loading ...</>;
    }
    if (isErrorOccured) {
        return <>Error occurred wile fetching the data for movie id: {id}</>;
    }
    return (
        <div>
            <div className="mx-6"><b>Edit Movie</b></div>
            <br />
            <MovieForm movieData={movieData} isEdit />
        </div>
    );
}
