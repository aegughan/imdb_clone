"use client";
import React, { useEffect, useState } from "react";
import Input from "./Input";
import ModalForm from "./ModalForm";
import Link from "next/link";
import { getApi, postApi } from "../services";
import { useRouter } from "next/navigation";

export default function MovieForm(props) {
    const router = useRouter()
    const { movieData, isEdit = false } = props;
    const initialFormData = {
        name: "",
        yearOfRelease: "",
        plot: "",
        poster: "",
        producer: "",
        actorsList: [],
    };
    const [formObj, setFormObj] = useState(initialFormData);
    const [formObjError, setFormObjError] = useState({});
   
    const [producerList, setProducerList] = useState([]);
    const [actorsList, setActorsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [isAddActor, setIsAddActor] = useState(false);
    const [isMovieCreationFailed, setIsMovieCreationFailed] = useState(false);

    const getProducerList = async () => {
        const producersData = await getApi("/api/producers");
        setProducerList(producersData);
        return true;
    };
    const getActorsList = async () => {
        const actorsData = await getApi("/api/actors");
        setActorsList(actorsData);
        return true;
    };

    useEffect(() => {
        if (isEdit) {
            const { name, plot, poster, producers, year_of_release, actor_movies } =
                movieData;
            setFormObj({
                name,
                yearOfRelease: year_of_release,
                plot: plot,
                poster: "",
                posterFile: poster,
                producer: producers?.id,
                actorsList: actor_movies?.map((obj) => {
                    return obj?.actors?.id;
                }),
            });
        }
    }, [movieData, isEdit]);
    const getDropdownData = async (callType) => {
        const dropdownGetList = [];
        if (callType.includes("producers")) {
            dropdownGetList.push(getProducerList());
        }
        if (callType.includes("actors")) {
            dropdownGetList.push(getActorsList());
        }
        await Promise.all(dropdownGetList).then(() => setLoading(false));
    };
    useEffect(() => {
        setLoading(true);
        getDropdownData(["producers", "actors"]);
    }, []);

   
    const onChangeHandler = (event) => {
        const id = event.target.id;
        if (id === "poster") {
            setFormObj({
                ...formObj,
                posterFile: event.target.files[0],
                [id]: event.target.value,
            });
            return
        }
        let value = event.target.value;
        setFormObj({
            ...formObj,
            [id]: value,
        });
    };

    const handleMultiSelectChange = (e) => {
        const selected = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        );
        setFormObj({
            ...formObj,
            actorsList: selected,
        });
    };

    const createMovie = async () => {
        const { name, yearOfRelease, plot, poster, posterFile, producer, actorsList } = formObj;
        const isErrorObj = {};
        if (name == "") {
            isErrorObj.name = "Name cannot be empty";
        }
        if (yearOfRelease == "") {
            isErrorObj.yearOfRelease = "Year of Release cannot be empty";
        }
        if (plot == "") {
            isErrorObj.plot = "Plot cannot be empty";
        }
        if (poster == "" && !isEdit) {
            isErrorObj.poster = "Poster cannot be empty";
        }
        if (producer == "") {
            isErrorObj.producer = "Select atleast one Producer";
        }
        if (actorsList?.length === 0) {
            isErrorObj.actorsList = "Select atleast one Actor";
        }
        if (Object.entries(isErrorObj).length > 0) {
            setFormObjError(isErrorObj);
            return;
        }
        setFormObjError({});
        const formData = new FormData();
        formData.append("name", name)
        formData.append("year_of_release", yearOfRelease)
        formData.append("plot", plot)
        if (poster) {
            formData.append("poster", posterFile)
        }
        formData.append("producer_id", producer)
        formData.append("actors_list", actorsList)

        setBtnLoading(true)
        if (isEdit) {
            await postApi(`/api/movies/${movieData.id}`, formData, true, "PUT", true)
                .then(() => {
                    router.push("/movies/list")
                    setIsMovieCreationFailed(false);
                })
                .catch(() => {
                    setIsMovieCreationFailed(true);
                })
                .finally(() => setBtnLoading(false));
        } else {
            await postApi(`/api/movies`, formData, true, "POST", true)
                .then(() => {
                    router.push("/movies/list")
                    setIsMovieCreationFailed(false);
                })
                .catch(() => {
                    setIsMovieCreationFailed(true);
                })
                .finally(() => setBtnLoading(false));
        }
    };

    const resetMovieData = () => {
        if (isEdit) {
            const { name, plot, poster, producers, year_of_release, actor_movies } =
                movieData;
            setFormObj({
                name,
                yearOfRelease: year_of_release,
                plot: plot,
                poster: "",
                posterFile: poster,
                producer: producers?.id,
                actorsList: actor_movies?.map((obj) => {
                    return obj?.actors?.id;
                }),
            });
        } else {
            setFormObj(initialFormData);
        }
    };
    if (loading) {
        return <div className="mx-6">Loading...</div>;
    }
    return (
        <div className="card mx-6">
            <div className="flexRow gap_20 mb-2">
                <Input
                    label={"Name"}
                    type="text"
                    id="name"
                    onChange={onChangeHandler}
                    value={formObj?.name}
                />
            </div>
            {formObjError?.name && <div className="error">{formObjError?.name}</div>}
            <div className="flexRow gap_20 mb-2">
                <Input
                    label={"Year of Release"}
                    type="date"
                    id="yearOfRelease"
                    onChange={onChangeHandler}
                    value={formObj?.yearOfRelease}
                />
            </div>
            {formObjError?.yearOfRelease && (
                <div className="error">{formObjError?.yearOfRelease}</div>
            )}
            <div className="flexRow gap_20 mb-2">
                <label>Plot:</label>
                <textarea
                    id="plot"
                    rows={5}
                    onChange={onChangeHandler}
                    value={formObj?.plot}
                />
            </div>
            {formObjError?.plot && <div className="error">{formObjError?.plot}</div>}

            <div className="flexRow gap_20 mb-2">
                <Input
                    label={"Poster"}
                    type="file"
                    id="poster"
                    onChange={onChangeHandler}
                    value={formObj?.poster}
                    fileName={formObj?.poster === '' && formObj?.posterFile ? formObj?.posterFile?.split("/")[formObj?.posterFile?.split("/").length - 1] : ""}
                />
            </div>
            {formObjError?.poster && (
                <div className="error">{formObjError?.poster}</div>
            )}

            <div className="flexRow gap_20 mb-2">
                <label>Select Producer:</label>
                <select
                    id="producer"
                    name="producer"
                    onChange={onChangeHandler}
                    value={formObj?.producer}
                >
                    <option value="">Select Producer</option>
                    {producerList?.map((producerObj, index) => {
                        return (
                            <option key={`producer_${index + 1}`} value={producerObj.id}>
                                {producerObj.name}
                            </option>
                        );
                    })}
                </select>
                <button
                    className="button"
                    onClick={() => {
                        setOpen(true);
                        setIsAddActor(false);
                        event.preventDefault();
                    }}
                >
                    Add Producer
                </button>
            </div>
            {formObjError?.producer && (
                <div className="error">{formObjError?.producer}</div>
            )}

            <div className="flexRow gap_20 mb-2">
                <label>Select Actors:</label>
                <select
                    id="producer"
                    name="producer"
                    onChange={handleMultiSelectChange}
                    value={formObj?.actorsList}
                    multiple
                >
                    {actorsList?.map((actorObj, index) => {
                        return (
                            <option key={`actor_${index + 1}`} value={actorObj.id}>
                                {actorObj.name}
                            </option>
                        );
                    })}
                </select>
                <button
                    className="button"
                    onClick={(event) => {
                        setOpen(true);
                        setIsAddActor(true);
                        event.preventDefault();
                    }}
                >
                    Add Actor
                </button>
            </div>
            {formObjError?.actorsList && (
                <div className="error">{formObjError?.actorsList}</div>
            )}
            <br />
            <div className="flexRow gap_20 mb-2">
                <button className="button" disabled={btnLoading} onClick={createMovie}>
                    {btnLoading ? (
                        <div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    ) :
                        <>{isEdit ? "Update" : "Create"}</>}


                </button>
                <button className="secondaryBtn" onClick={resetMovieData}>
                    Reset
                </button>
                <Link href="/movies/list">
                    <button className="button">Go to list</button>
                </Link>
            </div>
            {isMovieCreationFailed && (
                <div className="error">
                    Movie {isEdit ? "updation" : "creation"} failed
                </div>
            )}
            <ModalForm isAddActor={isAddActor} setOpen={setOpen} open={open} callBack={getDropdownData}/>
        </div>
    );
}
