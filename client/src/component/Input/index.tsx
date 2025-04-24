import React from "react";

export default function Input(props) {
  const { label, type, id, onChange, value } = props;
  return (
    <>
      <label>{label}:</label>
      <input type={type} id={id} name={id} onChange={onChange} value={value} />
    </>
  );
}
