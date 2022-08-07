import React, { Component, Fragment } from "react";

export default class RecruiterGraphQL extends Component {
  state = { recruiter: {}, isLoaded: false, error: null };

  componentDidMount() {
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
        this.setState({
          recruiter: data.data.recruiter,
          isLoaded: true,
        });
      });
  }

  render() {
    const { recruiter, isLoaded, error } = this.state;
    if (recruiter.genres) {
      recruiter.genres = Object.values(recruiter.genres);
    } else {
      recruiter.genres = [];
    }

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <p>Loading...</p>;
    } else {
      return (
        <Fragment>
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
                Company:{recruiter.company}
                </div>
                <div className="row">
                Title:{recruiter.title}
                </div>
                <div className="row">
                Linkedin:{recruiter.linkedin}
                </div>
                <div className="row">
                Emails:{recruiter.email}
                </div>
        </Fragment>
      );
    }
  }
}
