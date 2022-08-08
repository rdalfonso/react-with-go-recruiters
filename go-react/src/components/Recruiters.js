import React, { useEffect, useState, Fragment } from 'react';
import { Link } from "react-router-dom";
import styled from 'styled-components';

const BaseStyle = styled.div`
   font-size: 14px;
   width:"70%";
`;

const Recruiters = (props) => {
    const [recruiters, setRecruiter] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`http://localhost:4000/v1/recruiters/`)
        .then((response) => {
          if (response.status !== 200) {
            setError("Invalid response code: ", response.status);
          } else {
              setError(null);
          }
          return response.json();
        })
        .then((json) => {
            setRecruiter(json.recruiters);
        });
    }, []);

    if (error !== null) {
        return <div>Error: {error.message}</div>;
    } else {
        return (
            <Fragment>
                <BaseStyle>
                    <h2>Choose a recruiter</h2>
                    {   /* <button onClick={lazyImport}>Let imports</button> */ }
                    <div className="list-group">
                        {recruiters.map((m) => (
                        <Link
                            key={m.id}
                            className="list-group-item list-group-item-action"
                            to={`/recruiter/${m.id}`}
                        >
                        {m.name} ({m.title}) - {m.company}
                        </Link>
                        ))}
                    </div>
                </BaseStyle>
            </Fragment>
        );
    }
}

export default Recruiters;