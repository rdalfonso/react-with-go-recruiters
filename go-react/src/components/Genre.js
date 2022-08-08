import React, {useEffect, useState, Fragment} from 'react'
import { Link } from "react-router-dom"

const Genre = (props) => {
    let [recruiters, setRecruiters] = useState([]);
    const [error, setError] = useState(null);
    let [genreName, setGenreName] = useState("");
    
    useEffect(() => {
        fetch(`http://localhost:4000/v1/recruiters/` + props.match.params.id)
      .then((response) => {
        if (response.status !== 200) {
          setError("Invalid response: ", response.status);
        } else {
            setError(null);
        }
        return response.json();
      })
      .then((json) => {
        setGenreName(props.location.genreName);
        setRecruiters(json.recruiters);
      });
    }, [props.match.params.id, props.location.genreName]);

    

    if (!recruiters) {
      recruiters = [];
    }

    if (error !== null) {
        return <div>Error: {error.message}</div>;
    } else {
        return (
            <Fragment>
              <h2>Genre: {genreName}</h2>
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
            </Fragment>
          );
    }
}

export default Genre;