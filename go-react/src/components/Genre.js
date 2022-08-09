import React, {useEffect, useState, useCallback, Fragment} from 'react'
import { Link } from "react-router-dom"

import styled from 'styled-components';

const BaseStyle = styled.div`
   font-size: 14px;
   width:"70%";
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
              <div className="list-group">
                {recruiters.map((m) => (
                  <Link
                    key={m.id}
                    to={`/recruiters/${m.id}`}
                    className="list-group-item list-group-item-action"
                  >
                    {m.name}
                  </Link>
                ))}
              </div>
              </BaseStyle>
            </Fragment>
          );
    }
}

export default Genre;