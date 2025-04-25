import React from "react";
import Input from "./Input/index.jsx";


export default function ModalForm(props) {
    const {
        isAddActor,
        onModalChangeHandler,
        modalObj,
        modalObjError,
        saveModalData,
        onCloseModal,
        genderList,
    } = props;
    return (
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
    );
}
