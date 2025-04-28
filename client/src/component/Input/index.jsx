import React from "react";

export default function Input(props) {
    const { label, type, id, onChange, value, fileName } = props;
    return (
        <>
            <label>{label}:</label>
            <div className="inputs">
                <input type={type} id={id} name={id} onChange={onChange} value={value} />
                <span>{fileName}</span>
            </div>
        </>
    );
}
