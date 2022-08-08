import React, {useEffect, useState, Fragment } from 'react'
import { Link } from "react-router-dom";
import styled from 'styled-components';

const ListStyle = styled.div`
   font-size: 14px;
`;

const Admin = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [isLoaded, setIsLoaded] = useState("");

  useEffect(() => {
    fetch(`http://localhost:4000/v1/recruiters`)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        console.log('json.recruiters', json.recruiters);
        setRecruiters(json.recruiters);
        setIsLoaded(true);
      });
  }, []);

  if (!isLoaded) {
    return <p>Loading...</p>;
  } else {
    return (
      <Fragment>
        <h2>Manage Catalogue</h2>

        <div className="list-group">
          {recruiters.map((m) => (
            <Link
              key={m.id}
              className="list-group-item list-group-item-action"
              to={`/admin/recruiter/${m.id}`}
            >
             <ListStyle>{m.name} ({m.title})</ListStyle>
            </Link>
          ))}
        </div>
      </Fragment>
    );
  }
}

export default Admin;
