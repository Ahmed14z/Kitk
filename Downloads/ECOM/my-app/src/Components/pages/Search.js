import React, { useState } from "react";
import "./Search.css";

const Search = ({ history }) => {
  const [keyword, setKeyword] = useState("");

  const searchHandler = (e) => {
    e.preventDefault();

    if (keyword.trim()) {
      history.push(`/search/${keyword}`);
    } else {
      history.push("/");
    }
  };

  return (
    <form onSubmit={searchHandler}>
      <div className="input-group">
        <div className="input-group-prepend">
          <button id="search_btn" className="btn btn-outline-secondary">
            <i className="fa fa-search" aria-hidden="true"></i>
          </button>
        </div>
        <input
          type="text"
          id="search_field"
          className="form-control"
          placeholder="Enter Product Name ..."
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
    </form>
  );
};

export default Search;
