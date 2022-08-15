import React, { useEffect, useState, Fragment } from "react";
import { Link } from "react-router-dom";
import Input from "./form-components/Input";

import styled from 'styled-components';

const BaseStyle = styled.div`
   font-size: 14px;
   width:"70%";
`;


const GraphQL = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const performSearch = () => {
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
        let theList = Object.values(data.data.search);
        return theList;
      })
      .then((theList) => {
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
    const payload = `{
        list {
            id
            title
            runtime
            year
            description
        }
   }`;

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
    let theList = Object.values(data.data.list);
    return theList;
  })
  .then((theList) => {
    setRecruiters(theList);
  });
}, [])



return (
  <Fragment>
   <BaseStyle>

    <Input
      type={"text"}
      name={"search"}
      value={searchTerm}
      handleChange={handleChange}
      placeholder="Enter a recruiter name or company"
    />

    <div className="list-group">
      {recruiters.map((m) => (
        <Link
          key={m.id}
          className="list-group-item list-group-item-action"
          to={`/recruiter/${m.id}`}
        >
        {m.name} ({m.company}) -  {m.title} 
        </Link>
      ))}
    </div>
    </BaseStyle>
  </Fragment>
);
}

export default GraphQL;