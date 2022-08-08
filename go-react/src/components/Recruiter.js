import React, {useEffect, useState, Fragment} from 'react'

const Recruiter = (props) => {
    const [recruiter, setRecruiter] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:4000/v1/recruiter/` + props.match.params.id)
        .then((response) => {
        if (response.status !== 200) {
            setError("Invalid response: ", response.status);
        } else {
            setError(null);
        }
            return response.json();
        })
        .then((json) => {
          console.log('json', json)
          setRecruiter(json.recruiter);
        });
    }, [props.match.params.id]);

    if (recruiter.genres) {
      recruiter.genres = Object.values(recruiter.genres);
    } else {
      recruiter.genres = [];
    }

    if (error !== null) {
        return <div>Error: {error.message}</div>
    } else {
        return (
            <Fragment>
                <h2> Recruiter: {recruiter.name}</h2>
                <div>
                    <div >
                        {recruiter.genres.map((genre, index) =>(
                            <span className="badge bg-secondary me-1" key={index}>
                                {genre}
                            </span>
                        ))}
                    </div>
                    <br></br>
                    <div >
                        <strong>Company:</strong> {recruiter.company}  <br></br> <br></br>
                    </div>
      
                    <div>
                        <strong>Title:</strong> {recruiter.title}  <br></br> <br></br>
                    </div>
                    <div>
                        <strong>LinkedIn:</strong> {recruiter.linkedin}  <br></br> <br></br>
                    </div>
                    <div>
                        <strong>Email:</strong>{recruiter.email}  <br></br> <br></br>
                    </div>
                    <div>
                        <strong>Rating:</strong>{recruiter.stars}  <br></br> <br></br>
                    </div>
             </div>
            </Fragment>
          );
    }
}

export default Recruiter;