import React from "react";
import style from "./Searchbar.module.css";

const Searchbar = ({ search, placeholder }) => {
  const handleInputChange = (e) => {
    const newText = e.target.value;
    search(newText);
  };

  return (
    <div className={style.main_div}>
      <input
        type="text"
        name="search"
        placeholder={placeholder}
        onChange={handleInputChange}
        className={style.input_box}
      />
    </div>
  );
};

export default Searchbar;
