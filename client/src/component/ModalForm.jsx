"use client";
import React, { useState, useEffect } from "react";
import Input from "./Input/index.jsx";
import Modal from "./Modal/index.jsx";
import { getApi, postApi } from "../services/index.js";


export default function ModalForm(props) {
    const {
        isAddActor,
        open,
        setOpen,
        callBack
    } = props;

    const [genderList, setGenderList] = useState([]);
    const [isModalDataCreated, setIsModalDataCreated] = useState(false);
    const [isErrorWhileCreating, setIsErrorWhileCreating] = useState(false);

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


    useEffect(() => {
        const getGenderList = async () => {
            const genderData = await getApi("/api/gender");
            setGenderList(genderData);
            return true;
        };
        getGenderList()
    }, [])

    const intialModalData = {
        name: "",
        gender: "",
        dob: "",
        bio: "",
    };
    const [modalObj, setModalObj] = useState(intialModalData);
    const [modalObjError, setModalObjError] = useState(intialModalData);

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
        await postApi(`/api/${isAddActor ? "actors" : "producers"}`, modalObj, true)
            .then(() => {
                setIsModalDataCreated(true);
            })
            .catch(() => {
                setIsErrorWhileCreating(true);
            });
        if (callBack) {
            callBack([isAddActor ? "actors" : "producers"]);
            onCloseModal(event)
        }
    };
    return (
        <Modal isOpen={open} onClose={onCloseModal}>
            {isErrorWhileCreating ? (
                <>{`Error while creating ${isAddActor ? "actor" : "producer"} `}</>
            ) : isModalDataCreated ? (
                <>{`${isAddActor ? "Actor" : "Producer"} created successfully :)`}</>
            ) : (
                <>
                    <div>
                        <b>Create {isAddActor ? "Actor" : "Producer"}</b>
                    </div>
                    <br />
                    <br />
                    <div className="flexRow gap_20">
                        <Input
                            label={"Name"}
                            type="text"
                            id="name"
                            onChange={onModalChangeHandler}
                            value={modalObj?.name}
                        />
                    </div>
                    {modalObjError?.name && (
                        <div className="error">{modalObjError?.name}</div>
                    )}
                    <br />
                    <div className="flexRow gap_20">
                        <label>Select Gender:</label>
                        <select
                            id="gender"
                            name="gender"
                            onChange={onModalChangeHandler}
                            value={modalObj?.gender}
                        >
                            <option value="">Select Gender</option>
                            {genderList?.map((genderObj, index) => {
                                return (
                                    <option key={`gender_${index + 1}`} value={genderObj.id}>
                                        {genderObj.name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    {modalObjError?.gender && (
                        <div className="error">{modalObjError?.gender}</div>
                    )}
                    <br />
                    <div className="flexRow gap_20">
                        <Input
                            label={"DOB"}
                            type="date"
                            id="dob"
                            onChange={onModalChangeHandler}
                            value={modalObj?.dob}
                        />
                    </div>
                    {modalObjError?.dob && <div className="error">{modalObjError?.dob}</div>}
                    <br />
                    <div className="flexRow gap_20">
                        <label>Bio:</label>
                        <textarea
                            id="bio"
                            rows={5}
                            onChange={onModalChangeHandler}
                            value={modalObj?.bio}
                        />
                    </div>
                    {modalObjError?.bio && <div className="error">{modalObjError?.bio}</div>}
                    <br />
                    <div className="alignRight flexRow gap_20">
                        <button className="button" onClick={saveModalData}>
                            Save
                        </button>
                        <button className="secondaryBtn" onClick={onCloseModal}>
                            Close
                        </button>
                    </div>
                </>
            )}
        </Modal>

    );
}
