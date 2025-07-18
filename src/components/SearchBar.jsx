import React from "react";

const SearchBar = ({ value, onChange }) => (
  <input
    type="search"
    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
    placeholder="Search contestants..."
    value={value}
    onChange={e => onChange(e.target.value)}
    aria-label="Search contestants"
    autoComplete="off"
  />
);

export default SearchBar; 