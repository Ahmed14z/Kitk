export default class APIService {
  static UpdatePerson(id, name, age, gender, email) {
    return fetch(
      `https://${process.env.REACT_APP_BACKEND_HOST}/persons/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // content type
          // your request url
        },
        body: JSON.stringify({
          name: name,
          age: age,
          email: email,
          gender: gender,
        }),
      }
    ).then((resp) => resp.json());
  }

  static addPerson(name, age, gender, email) {
    return fetch(`https://${process.env.REACT_APP_BACKEND_HOST}/persons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // content type
        // your request url
      },
      body: JSON.stringify({
        name: name,
        age: age,
        email: email,
        gender: gender,
      }),
    }).then((resp) => resp.json());
  }
  static getUser(id) {
    return fetch(`https://${process.env.REACT_APP_BACKEND_HOST}/user/${id}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .catch((err) => console.log(err));
  }

  static deletePerson(id) {
    return fetch(
      `https://${process.env.REACT_APP_BACKEND_HOST}/persons/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json", // content type
          // your request url
        },

        // age: ,
        // email: JSON.stringify({ email }),
        // gender: JSON.stringify({ gender }),
        // name: JSON.stringify({ name }),
      }
    );
  }
}
