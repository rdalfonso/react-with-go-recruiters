import React, {useEffect, useState, useCallback, Fragment } from 'react'
import { Link } from "react-router-dom";
import styled from 'styled-components';

const ListStyle = styled.div`
   font-size: 14px;
`;

const ListItem = styled.li`
  position: relative;
  display: block;
  padding: 0.5rem 1rem;
  color: #212529;
  text-decoration: none;
  background-color: #fff;
  border: 1px solid rgba(0,0,0,.125);

  a {
    font-style: none;
    font-size: 14px;
    color: green;
  }
`;

const Admin = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [isLoaded, setIsLoaded] = useState("");
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
       const response = await fetch(`http://localhost:4000/v1/recruiters/`);
       const data = await response.json();
       setRecruiters(data.recruiters);
       setIsLoaded(true);
    } catch(err) {
      setError(err)
    }
  }, []);

   useEffect(() => {
     fetchData()
   }, [fetchData]);

  if (!isLoaded) {
    return <p>Loading...</p>;
  } else {
    return (
      <Fragment>
        <h2>Manage Catalogue</h2>
        <div>
          {recruiters.map((m) => (
            <ListItem>
            <Link
              key={m.id}
              to={`/admin/recruiter/${m.id}`}
            >
             <ListStyle>{m.name} ({m.title})</ListStyle>
            </Link>
          </ListItem>
          ))}
        </div>
        {error && <div>{error}</div>}
      </Fragment>
    );
  }
}

export default Admin;
