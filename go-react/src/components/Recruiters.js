import React, { useEffect, useState, useCallback, Fragment } from 'react';
import { Link } from "react-router-dom";
import styled from 'styled-components';

const BaseStyle = styled.div`
   font-size: 14px;
   width:"70%";
`;


const Recruiters = (props) => {
    const [recruiters, setRecruiter] = useState([]);
    const [error, setError] = useState("");

   const fetchData = useCallback(async () => {
     try {
        const response = await fetch(`http://localhost:4000/v1/recruiters/`);
        console.log(response);
        const data = await response.json();
        console.log(data);
        setRecruiter(data.recruiters);
     } catch(err) {
        console.log(err);
       setError(err)
     }
   }, []);

    useEffect(() => {
      fetchData()
    }, [fetchData]);

    if (error.length > 0) {
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