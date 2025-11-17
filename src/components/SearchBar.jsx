import React from "react";
import { IoSearchOutline } from "react-icons/io5";
import "./SearchBar.css";

export default function SearchBar({ search, setSearch }) {
  const handleChange = (e) => {
    const value = e.target.value.replace(/\s+/g, "");
    setSearch(value);
  };
  return (
    <div className="searchbar-container">
      <div className="searchbar-input-wrapper">
        <IoSearchOutline className="searchbar-icon" size={20} />
        <input
          type="text"
          className="searchbar-input"
          placeholder="Search Vehicle"
          value={search}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
