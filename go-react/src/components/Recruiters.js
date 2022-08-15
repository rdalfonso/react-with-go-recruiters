import React, { useEffect, useState, useCallback, Fragment } from 'react';
import { Link } from "react-router-dom";
import styled from 'styled-components';

const BaseStyle = styled.div`
   font-size: 14px;
   width:"70%";
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
                    <div>
                        {recruiters.map((m) => (
                        <ListItem>
                        <Link key={m.id} to={`/recruiter/${m.id}`}>
                        {m.name} ({m.title}) - {m.company}
                        </Link>
                        </ListItem>
                        ))}
                    </div>
                </BaseStyle>
            </Fragment>
        );
    }
}

export default Recruiters;