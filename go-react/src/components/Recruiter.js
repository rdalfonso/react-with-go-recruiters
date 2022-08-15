import React, {useEffect, useState, useCallback, Fragment} from 'react'
import styled from 'styled-components';
import Review from './Review';

const BaseStyle = styled.div`
   font-size: 14px;
   width:"70%";
`;

const Recruiter = (props) => {
    const [recruiter, setRecruiter] = useState({});
    const [error, setError] = useState(null);


    const fetchData = useCallback(async () => {
        try {
           const response = await fetch(`http://localhost:4000/v1/recruiter/` + props.match.params.id)
           console.log(response);
           const data = await response.json();
           console.log(data);
           setRecruiter(data.recruiter);
        } catch(err) {
           console.log(err);
           setError(err)
        }
      }, []);
   
       useEffect(() => {
         fetchData()
       }, [fetchData]);

    if (recruiter.genres) {
      recruiter.genres = Object.values(recruiter.genres);
    } else {
      recruiter.genres = [];
    }

    if (recruiter.reviews) {
        recruiter.reviews = Object.values(recruiter.reviews);
      } else {
        recruiter.reviews = [];
      }

    if (error !== null) {
        return <div>Error: {error.message}</div>
    } else {
        return (
            <Fragment>
             <BaseStyle>
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
                     <div>
                       <h5>Reviews for this recruiter</h5>
                    </div>
                    <div>
                       {recruiter.reviews.length <= 0 && (
                        <>No reviews for {recruiter.name}. Be the first to review</>
                       )}
                       {recruiter.reviews.map((review, index) => {
                         return <Review review={review} key={index} />
                       })}
                    </div>

             </div>
             </BaseStyle>
            </Fragment>
          );
    }
}

export default Recruiter;