import React, {useEffect, useState, Fragment } from 'react'
import { Link } from "react-router-dom";

const Admin = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [error, setError] = useState(null);
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

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
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
             {m.name} ({m.title})
            </Link>
          ))}
        </div>
      </Fragment>
    );
  }
}

export default Admin;
