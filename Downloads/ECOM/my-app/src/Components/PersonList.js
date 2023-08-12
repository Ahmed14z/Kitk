import React from "react";
import APIService from "./APIService";

function PersonList(props) {
  const editPerson = (person) => {
    props.editPerson(person);
  };
  const deletePerson = (person) => {
    APIService.deletePerson(person.id).then(() => props.deletePerson(person));
  };
  return (
    <div>
      {props.persons &&
        props.persons.map((person) => {
          return (
            <div key={person.id}>
              <h2>
                Name: {person.name} | Age: {person.age} | Gender:
                {person.gender} | Email: {person.email}{" "}
                <div className="row">
                  <div className="col-md-1">
                    <button
                      
                      className="btn btn-primary"
                      onClick={() => editPerson(person)}
                    >
                      Update
                    </button>
                  </div>
                  <div className="col-md-1">
                    <button
                      className="btn btn-danger"
                      onClick={() => deletePerson(person)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <hr />
              </h2>
              <p></p>
            </div>
          );
        })}
    </div>
  );
}

export default PersonList;
