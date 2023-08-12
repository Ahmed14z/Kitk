import React, { useState, useEffect } from "react";
import APIService from "./APIService";

function Form(props) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    setName(props.person.name);
    setAge(props.person.age);
    setEmail(props.person.email);
    setGender(props.person.gender);
  }, [props.person]);

  const updatePerson = () => {
    APIService.UpdatePerson(props.person.id, name, age, gender, email)

      .then((resp) => props.updatedData(resp))
      .catch((error) => console.log(error));
  };
  const addPerson = () => {
    APIService.addPerson(name, age, gender, email)
      .then((resp) => props.addedPerson(resp))
      .catch((error) => console.log(error));
  };
  return (
    <div>
      {props.person ? (
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Name:
          </label>

          <input
            type="test"
            className="form-control"
            value={name}
            placeholder="Please enter a name"
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="title" className="form-label">
            Age:
          </label>

          <input
            type="test"
            className="form-control"
            value={age}
            placeholder="Please enter an age"
            onChange={(e) => setAge(e.target.value)}
          />
          <label htmlFor="title" className="form-label">
            Gender:
          </label>

          <input
            type="test"
            className="form-control"
            value={gender}
            placeholder="Please enter a gender"
            onChange={(e) => setGender(e.target.value)}
          />
          <label htmlFor="title" className="form-label">
            Email:
          </label>

          <input
            type="test"
            className="form-control"
            value={email}
            placeholder="Please enter an email"
            onChange={(e) => setEmail(e.target.value)}
          />
          {props.person.id ? (
            <button onClick={updatePerson} className="btn btn-success mt-3 ">
              Update
            </button>
          ) : (
            <button onClick={addPerson} className="btn btn-success mt-3">
              Add
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default Form;
