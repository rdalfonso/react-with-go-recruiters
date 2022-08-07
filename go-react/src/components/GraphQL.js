import React, { useEffect, useState, Fragment } from "react";
import { Link } from "react-router-dom";
import Input from "./form-components/Input";


const GraphQL = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const performSearch = () => {
    console.log('searchTerm', searchTerm);
    const payload = `
        {
            search(nameContains: "${searchTerm}") {
                id
                name
                title
                company
                linkedin
            }
        }
        `;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "POST",
      body: payload,
      headers: myHeaders,
    };

    fetch(`http://localhost:4000/v1/graphql`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let theList = Object.values(data.data.search);
        return theList;
      })
      .then((theList) => {
        console.log(theList);
        if (theList.length > 0) {
          setRecruiters(theList);
        } else {
          setRecruiters([]);
        }
      });
  }

  const handleChange = (evt) => {
    let value = evt.target.value;

    setSearchTerm(value)

    if (value.length > 2) {
      performSearch();
    } else {
      setRecruiters(recruiters);
    }
  };

  useEffect(() => {
    const payload = `
    {
        list {
            id
            title
            runtime
            year
            description
        }
    }
    `;

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const requestOptions = {
  method: "POST",
  body: payload,
  headers: myHeaders,
};

fetch(`/v1/graphql`, requestOptions)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    let theList = Object.values(data.data.list);
    return theList;
  })
  .then((theList) => {
    console.log(theList);
    this.setState({
      recruiters: theList,
    });
  });
}, [])



return (
  <Fragment>
    <h2>Enter a recruiter name or company</h2>

    <Input
      type={"text"}
      name={"search"}
      value={searchTerm}
      handleChange={handleChange}
    />

    <div className="list-group">
      {recruiters.map((m) => (
        <Link
          key={m.id}
          className="list-group-item list-group-item-action"
          to={`/recruitersgraphql/${m.id}`}
        >
        {m.name} ({m.company}) -  {m.title} 
        </Link>
      ))}
    </div>
  </Fragment>
);
}

export default GraphQL;