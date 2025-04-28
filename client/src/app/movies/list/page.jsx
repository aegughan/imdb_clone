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
                <div className="d-flex flex-row gap_10 flex-wrap">
                    {moviesList?.map((movieObj, index) => {
                        return (
                            <div className="card p-0 w-24" key={`movie_${index + 1}`}>
                                <Image alt={`poster-${index + 1}`} src={movieObj.poster} width={100} height={100}   layout="responsive"  />
                                <div className="px-3 pb-3">
                                <div className="d-flex flex-row gap_10">
                                    <b>Name:</b> {movieObj.name}
                                </div>
                                <div className="d-flex flex-row gap_10">
                                    <b>Year of Release:</b> {movieObj.year_of_release.split("-")[0]}
                                </div>
                                <div className="d-flex flex-row gap_10">
                                    <b>Plot:</b>
                                    <span className="ellipsis">{movieObj.plot}
                                        <span className="hidden-text">{movieObj.plot}</span>
                                    </span>
                                </div>
                                <div className="d-flex flex-row gap_10">
                                    <b>Actors:</b>{" "}
                                    <span className="ellipsis">
                                        {movieObj.actor_movies
                                            .map((ma, idx) => {return <Link key={`actor${idx+1}`} href={`/actor/${ma?.actors?.id}`}>{ma?.actors?.name}{idx !== movieObj.actor_movies.length -1 ? ", " : ""}</Link>})
                                            }
                                    </span>
                                </div>
                                <div className="d-flex flex-row gap_10">
                                    <b>Producer:</b> {movieObj.producers.name}
                                </div>
                                <div className="alignRight">
                                    <Link href={`/movies/edit/${movieObj.id}`}>
                                        <button className="button">Edit</button>
                                    </Link>
                                </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
