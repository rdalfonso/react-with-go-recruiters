import React, {useEffect, useState, useCallback, Fragment} from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components';

const BaseStyle = styled.div`
   font-size: 14px;
   width:"70%";
`;

const Genres = () => {
    const [genres, setGenres] = useState([]);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
      try {
         const response = await fetch(`http://localhost:4000/v1/genres/`);
         console.log(response);
         const data = await response.json();
         console.log(data);
         setGenres(data.genres);
      } catch(err) {
         console.log(err);
        setError(err)
      }
    }, []);
 
     useEffect(() => {
       fetchData()
     }, [fetchData]);

    if (error !== null) {
        return <div>Error: {error.message}</div>
    }
    return (
        <Fragment>
          <h2>Genres</h2>
          <BaseStyle>
            <div className="list-group">
              {genres.map((m) => (
                <Link
                  key={m.id}
                  className="list-group-item list-group-item-action"
                  to={{
                    pathname: `/genre/${m.id}`,
                    genreName: m.genre_name,
                  }}
                >
                  {m.genre_name}
                </Link>
              ))}
            </div>
            {error && <div>Error: {error.message}</div>}
          </BaseStyle>
        </Fragment>
    );
}

export default Genres;