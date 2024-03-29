import React from "react";

const MemoizedInput = React.memo(
  ({
    id,
    placeholder,
    className,
    onChange,
  }: {
    id: string;
    placeholder: string;
    className: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => {
    return (
      <input
        id={id}
        type="number"
        placeholder={placeholder}
        className={className}
        onChange={onChange}
      />
    );
  }
);

export default MemoizedInput;
