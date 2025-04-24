"use client";
import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import Input from "./Input";
import ModalForm from "./ModalForm";
import Link from "next/link";
import { getApi, postApi } from "../services";

export default function MovieForm(props) {
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
  const intialModalData = {
    name: "",
    gender: "",
    dob: "",
    bio: "",
  };
  const [modalObj, setModalObj] = useState(intialModalData);
  const [modalObjError, setModalObjError] = useState(intialModalData);
  const [producerList, setProducerList] = useState([]);
  const [actorsList, setActorsList] = useState([]);
  const [genderList, setGenderList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isAddActor, setIsAddActor] = useState(false);
  const [isModalDataCreated, setIsModalDataCreated] = useState(false);
  const [isErrorWhileCreating, setIsErrorWhileCreating] = useState(false);
  const [isMovieCreated, setIsMovieCreated] = useState(false);
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
  const getGenderList = async () => {
    const genderData = await getApi("/api/gender");
    setGenderList(genderData);
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
        poster: poster,
        producer: producers?.id,
        actorsList: actor_movies?.map((obj) => {
          return obj?.actors?.id;
        }),
      });
    }
  }, [movieData, isEdit]);
  const getDropdownData = async (callType) => {
    setLoading(true);
    const dropdownGetList = [];
    if (callType.includes("producers")) {
      dropdownGetList.push(getProducerList());
    }
    if (callType.includes("actors")) {
      dropdownGetList.push(getActorsList());
    }
    if (callType.includes("gender")) {
      dropdownGetList.push(getGenderList());
    }
    await Promise.all(dropdownGetList).then(() => setLoading(false));
  };
  useEffect(() => {
    getDropdownData(["producers", "actors", "gender"]);
  }, []);

  const saveModalData = async (event) => {
    event.preventDefault();
    const isErrorObj = {};
    const { name, gender, dob, bio } = modalObj;
    if (name == "") {
      isErrorObj.name = "Name cannot be empty";
    }
    if (gender == "") {
      isErrorObj.gender = "Gender cannot be empty";
    }
    if (dob == "") {
      isErrorObj.dob = "DOB cannot be empty";
    }
    if (bio == "") {
      isErrorObj.bio = "Bio cannot be empty";
    }
    if (Object.entries(isErrorObj).length > 0) {
      setModalObjError({ ...isErrorObj });
      return;
    }
    setModalObjError({});
    await postApi(`/api/${isAddActor ? "actors" : "producers"}`, modalObj)
      .then(() => {
        setIsModalDataCreated(true);
      })
      .catch(() => {
        setIsErrorWhileCreating(true);
      });
    getDropdownData([isAddActor ? "actors" : "producers"]);
  };

  const onChangeHandler = (event) => {
    const value = event.target.value;
    const id = event.target.id;
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

  const onModalChangeHandler = (event) => {
    const value = event.target.value;
    const id = event.target.id;
    setModalObj({
      ...modalObj,
      [id]: value,
    });
  };

  const onCloseModal = (event) => {
    event.preventDefault();
    setOpen(false);
    setModalObj(intialModalData);
    setModalObjError(intialModalData);
    setIsModalDataCreated(false);
    setIsErrorWhileCreating(false);
  };

  const createMovie = async () => {
    const { name, yearOfRelease, plot, poster, producer, actorsList } = formObj;
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
    if (poster == "") {
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
    const data = {
      name,
      year_of_release: yearOfRelease,
      plot,
      poster,
      producer_id: producer,
      actors_list: actorsList,
    };
    if (isEdit) {
      await postApi(`/api/movies/${movieData.id}`, data, "PUT")
        .then(() => {
          setIsMovieCreated(true);
          setIsMovieCreationFailed(false);
        })
        .catch(() => {
          setIsMovieCreationFailed(true);
        });
    } else {
      await postApi(`/api/movies`, data)
        .then(() => {
          setIsMovieCreated(true);
          setIsMovieCreationFailed(false);
        })
        .catch(() => {
          setIsMovieCreationFailed(true);
        });
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
        poster: poster,
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
    return <div>Loading...</div>;
  }
  if (isMovieCreated) {
    return (
      <div>
        <div>Movie {isEdit ? "updated" : "created"} successfully</div>
        <Link href="/movies/list">
          <button className="button">Go to list</button>
        </Link>
      </div>
    );
  }
  return (
    <div>
      <br />
      <div className="flexRow gap_20">
        <Input
          label={"Name"}
          type="text"
          id="name"
          onChange={onChangeHandler}
          value={formObj?.name}
        />
      </div>
      {formObjError?.name && <div className="error">{formObjError?.name}</div>}
      <br />
      <div className="flexRow gap_20">
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
      <br />
      <div className="flexRow gap_20">
        <label>Plot:</label>
        <textarea
          id="plot"
          rows={5}
          onChange={onChangeHandler}
          value={formObj?.plot}
        />
      </div>
      {formObjError?.plot && <div className="error">{formObjError?.plot}</div>}
      <br />
      <div className="flexRow gap_20">
        <Input
          label={"Poster"}
          type="text"
          id="poster"
          onChange={onChangeHandler}
          value={formObj?.poster}
        />
      </div>
      {formObjError?.poster && (
        <div className="error">{formObjError?.poster}</div>
      )}
      <br />
      <div className="flexRow gap_20">
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
      <br />
      <div className="flexRow gap_20">
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
      <div className="flexRow gap_20">
        <button className="button" onClick={createMovie}>
          {isEdit ? "Update" : "Create"}
        </button>
        <button className="secondaryBtn" onClick={resetMovieData}>
          Reset
        </button>
        <Link href="/movies/list">
          <button className="button">Go to list</button>
        </Link>
      </div>
      <br />
      {isMovieCreationFailed && (
        <div className="error">
          Movie {isEdit ? "updation" : "creation"} failed
        </div>
      )}
      <Modal isOpen={open} onClose={onCloseModal}>
        {isErrorWhileCreating ? (
          <>{`Error while creating ${isAddActor ? "actor" : "producer"} `}</>
        ) : isModalDataCreated ? (
          <>{`${isAddActor ? "Actor" : "Producer"} created successfully :)`}</>
        ) : (
          <ModalForm
            isAddActor={isAddActor}
            onModalChangeHandler={onModalChangeHandler}
            modalObj={modalObj}
            modalObjError={modalObjError}
            saveModalData={saveModalData}
            genderList={genderList}
            onCloseModal={onCloseModal}
          />
        )}
      </Modal>
    </div>
  );
}
