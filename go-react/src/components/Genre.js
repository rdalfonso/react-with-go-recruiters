import React, {useEffect, useState, useCallback, Fragment} from 'react'
import { Link } from "react-router-dom"

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

const Genre = (props) => {
    let [recruiters, setRecruiters] = useState([]);
    const [error, setError] = useState(null);
    let [genreName, setGenreName] = useState("");

    const fetchData = useCallback(async () => {
      try {
         const response = await fetch(`http://localhost:4000/v1/recruiters/` + props.match.params.id);
         const data = await response.json();
         setGenreName(props.location.genreName);
         setRecruiters(data.recruiters);

      } catch(err) {
        setError(err)
      }
    }, [props.match.params.id, props.location.genreName]);
 
    useEffect(() => {
      fetchData()
    }, [fetchData]);


    if (!recruiters) {
      recruiters = [];
    }

    if (error !== null) {
        return <div>Error: {error.message}</div>;
    } else {
        return (
            <Fragment>
              <h2>Genre: {genreName}</h2>
              <BaseStyle>
              <div>
                {recruiters.map((m) => (
                  <ListItem>
                  <Link
                    key={m.id}
                    to={`/recruiters/${m.id}`}
                  >
                    {m.name}
                  </Link>
                  </ListItem>
                ))}
              </div>
              </BaseStyle>
            </Fragment>
          );
    }
}

export default Genre;