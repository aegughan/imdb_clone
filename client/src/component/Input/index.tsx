import React from "react";

interface Input {
  label: string;
  type: string;
  id: string;
  onChange: any;
  value: string;
}
export default function Input(props: Input) {
  const { label, type, id, onChange, value } = props;
  return (
    <>
      <label>{label}:</label>
      <input type={type} id={id} name={id} onChange={onChange} value={value} />
    </>
  );
}
