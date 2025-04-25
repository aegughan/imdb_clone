"use client";
import { getApi } from "../../../services";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function List() {
    const [moviesList, setMoviesList] = useState([]);
    const [loading, setLoading] = useState(false);

    const getMoviesList = async () => {
        setLoading(true);
        const moviesListData = await getApi("/api/movies");
        setMoviesList(moviesListData);
        setLoading(false);
    };

    useEffect(() => {
        getMoviesList();
    }, []);

    return (
        <div>
            <div className="flexRow space-between align-center">
                <p>Movies List</p>
                <Link href={"/movies/create"}>
                    <button className="button">Create Movie</button>
                </Link>
            </div>
            {loading ? (
                "Loading...."
            ) : (
                <>
                    {moviesList?.map((movieObj, index) => {
                        return (
                            <div className="card" key={`movie_${index + 1}`}>
                                <Image alt={`poster-${index + 1}`} src={movieObj.poster} width={50} height={50} />
                                <div>
                                    <b>Name:</b> {movieObj.name}
                                </div>
                                <div>
                                    <b>Year of Release:</b> {movieObj.year_of_release}
                                </div>
                                <div>
                                    <b>Plot:</b> {movieObj.plot}
                                </div>
                                <div>
                                    <b>Actors:</b>{" "}
                                    {movieObj.actor_movies
                                        .map((ma) => ma?.actors?.name)
                                        .join(", ")}
                                </div>
                                <div>
                                    <b>Producer:</b> {movieObj.producers.name}
                                </div>
                                <div className="alignRight">
                                    <Link href={`/movies/edit/${movieObj.id}`}>
                                        <button className="button">Edit</button>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </>
            )}
        </div>
    );
}
