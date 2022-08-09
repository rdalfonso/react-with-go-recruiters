import React, {useEffect, useState, useCallback, Fragment } from 'react'
import { Link } from "react-router-dom";
import styled from 'styled-components';

const ListStyle = styled.div`
   font-size: 14px;
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
        {error && <div>{error}</div>}
      </Fragment>
    );
  }
}

export default Admin;
