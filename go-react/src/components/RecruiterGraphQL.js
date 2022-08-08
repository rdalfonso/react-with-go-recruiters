import React, { Fragment, useState, useEffect } from "react";
import styled from 'styled-components';

const BaseStyle = styled.div`
   font-size: 14px;
   width:"70%";
`;

const RecruiterGraphQL = () => {
  const [recruiter, setRecruiter] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
   
  useEffect(() => {
    const payload = `
    {
        recruiter(id: ${this.props.match.params.id}) {
            id
            name
            title
            linkedin
            company
            email
            stars
        }
    }
    `;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "POST",
      body: payload,
      headers: myHeaders,
    };

    fetch(`http://localhost:4000/v1/graphql`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log('graphql', data);
        setRecruiter(data.data.recruiter);
        setIsLoaded(true);
      });
}, []);

  if (recruiter.genres) {
    recruiter.genres = Object.values(recruiter.genres);
  } else {
    recruiter.genres = [];
  }

if (!isLoaded) {
    return <p>Loading...</p>;
  } else {
    return (
        <Fragment>
          <BaseStyle>
              <h2>Recruiter: {recruiter.name} ({recruiter.company})</h2>
              <div>Rating: {recruiter.stars}</div>
              <div>
                  {recruiter.genres.map((genre, index) =>(
                      <span className="badge bg-secondary me-1" key={index}>
                          {genre}
                      </span>
                  ))}
              </div>
              <div className="row">
                Company: {recruiter.company}
              </div>
              <div className="row">
                Title: {recruiter.title}
              </div>
              <div className="row">
                Linkedin: {recruiter.linkedin}
              </div>
              <div className="row">
                Emails: {recruiter.email}
              </div>
              </BaseStyle>
        </Fragment>
    );
  }
}

export default RecruiterGraphQL;
