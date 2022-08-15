import React, {useEffect, useState, Fragment} from 'react'
import Input from "./form-components/Input";
import Select from "./form-components/Select";
import Alert from "./ui-components/Alert";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Link } from 'react-router-dom'; 

import styled from 'styled-components';

const BaseStyle = styled.div`
   font-size: 14px;
   width:"70%";
`;

const EditRecruiter = (props) => {
    const [recruiter, setRecruiter] = useState({});
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState([]);

    let [alert, setAlert] = useState({type: "d-none", message: ""});
    
    const mpaaOptions = [
        { id: "1", value: 1 },
        { id: "2", value: 2 },
        { id: "3", value: 3 },
        { id: "4", value: 4 },
        { id: "5", value: 5 },
    ];

    useEffect(() => {
        if (props.jwt === "") {
            props.history.push({
                pathname: "/login",
            });
            return;
        }

        const id = props.match.params.id;
        if (id > 0) {
            fetch(`http://localhost:4000/v1/recruiter/` + id)
              .then((response) => {
                if (response.status !== 200) {
                  setError("Invalid response: ", response.status);
                }
                return response.json();
              })
              .then((json) => {
                setRecruiter(json.recruiter);
              });
          }
    }, [props.history, props.jwt, props.match.params.id]);

    const handleChange = () => (
        evt,
      ) => {
        let value = evt.target.value;
        let name = evt.target.name;
        setRecruiter({
          ...recruiter,
          [name]: value,
        });
      };

    const handleSubmit = (evt) => {
        evt.preventDefault();
        // do validation
        let errors = [];
        if (recruiter.title === "") {
          errors.push("title");
        }
    
        setErrors(errors);
    
        if (errors.length > 0) {
          return false;
        }
    
        const data = new FormData(evt.target);
        const payload = Object.fromEntries(data.entries());
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + props.jwt);

        console.log(JSON.stringify(payload))
    
        const requestOptions = {
          method: "POST",
          body: JSON.stringify(payload),
          headers: myHeaders,
        };

        fetch("http://localhost:4000/v1/admin/editrecruiter", requestOptions)
          .then((response) => response.json())
          .then((data) => {
            if (data.error) {
              setAlert({
                alert: { type: "alert-danger", message: data.error.message },
              });
            } else {
              props.history.push({
                pathname: "/admin",
              });
            }
          });
      };

      const confirmDelete = (e) => {    
        confirmAlert({
          title: "Delete Recruiter?",
          message: "Are you sure?",
          buttons: [
            {
              label: "Yes",
              onClick: () => {
                // delete the recruiter
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("Authorization", "Bearer " + props.jwt);
    
                fetch(
                  `http://localhost:4000/v1/admin/deleterecruiter/` +
                  recruiter.id,
                  {
                    method: "GET",
                    headers: myHeaders,
                  }
                )
                  .then((response) => response.json)
                  .then((data) => {
                    if (data.error) {
                      setAlert({type: "alert-danger", message: data.error.message})
                    } else {
                        setAlert({type: "alert-success", message: "Recruiter deleted!"})
                        props.history.push({
                            pathname: "/admin",
                        });
                    }
                  });
              },
            },
            {
              label: "No",
              onClick: () => {},
            },
          ],
        });
      };

      function hasError(key) {
        return errors.indexOf(key) !== -1;
      }

      if (error !== null) {
        return <div>Error: {error.message}</div>;
      } else {
        return (
            <Fragment>
              <h2>Add/Edit Recruiter</h2>
              <Alert
                alertType={alert.type}
                alertMessage={alert.message}
              />
            <BaseStyle>
              <form onSubmit={handleSubmit}>
                <input
                  type="hidden"
                  name="id"
                  id="id"
                  value={recruiter.id}
                />
                 <Input
                  title={"Name"}
                  className={hasError("name") ? "is-invalid" : ""}
                  type={"text"}
                  name={"name"}
                  value={recruiter.name}
                  errorDiv={hasError("name") ? "text-danger" : "d-none"}
                  errorMsg={"Please enter a name"}
                  handleChange={handleChange("name")}
                />
    
                <Input
                  title={"Title"}
                  className={hasError("title") ? "is-invalid" : ""}
                  type={"text"}
                  name={"title"}
                  value={recruiter.title}
                  errorDiv={hasError("title") ? "text-danger" : "d-none"}
                  errorMsg={"Please enter a title"}
                  handleChange={handleChange("title")}
                />

              <Input
                  title={"Linkedin"}
                  className={hasError("linkedin") ? "is-invalid" : ""}
                  type={"text"}
                  name={"linkedin"}
                  value={recruiter.linkedin}
                  errorDiv={hasError("linkedin") ? "text-danger" : "d-none"}
                  errorMsg={"Please enter a linkedin"}
                  handleChange={handleChange("linkedin")}
                />

              <Input
                  title={"Email"}
                  className={hasError("email") ? "is-invalid" : ""}
                  type={"text"}
                  name={"email"}
                  value={recruiter.email}
                  errorDiv={hasError("email") ? "text-danger" : "d-none"}
                  errorMsg={"Please enter a valid email"}
                  handleChange={handleChange("email")}
                />

                <Input
                  title={"Company"}
                  className={hasError("company") ? "is-invalid" : ""}
                  type={"text"}
                  name={"company"}
                  value={recruiter.company}
                  errorDiv={hasError("company") ? "text-danger" : "d-none"}
                  errorMsg={"Please enter a company"}
                  handleChange={handleChange("company")}
                />
    
    
                <Select
                  title={"Stars"}
                  name={"stars"}
                  options={mpaaOptions}
                  value={recruiter.stars}
                  placeholder="Choose..."
                  handleChange={handleChange("stars")}
                />
    
    
                <button>Save</button>
                <Link to="/admin">
                  Cancel
                </Link>
                {recruiter.id > 0 && (
                  <a
                    href="#!"
                    onClick={() => confirmDelete()}
                  >
                    Delete
                  </a>
                )}
              </form>
              </BaseStyle>
            </Fragment>
          );
      }
}

export default EditRecruiter;