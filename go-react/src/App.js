import React, {useState, useEffect, Fragment} from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Admin from "./components/Admin";
import Home from "./components/Home";

import GraphQL from "./components/GraphQL";
import Recruiters from "./components/Recruiters";
import Genres from "./components/Genres";
import Recruiter from "./components/Recruiter";
import Genre from "./components/Genre";
import EditRecruiter from "./components/EditRecruiter";
import Login from "./components/Login";

const App = () => {
    const [jwt, setJWT] = useState("");
    const [Login, setLogin] = useState(null);

    useEffect(() => {
        let token = window.localStorage.getItem("jwt");
        if (token && jwt === "") {
          setJWT(JSON.parse(token));
        }
    }, [jwt])

    const handleJWTChange = (jwt) => {
        setJWT(jwt);
    }

    const logout = () => {
        setJWT("");
        window.localStorage.removeItem("jwt");
        window.location.href='/';
    }
            

    let loginLink;
    let signUpLink;
 
    if (jwt === "") {
      loginLink = <button 
                    onClick={(e) => {  e.preventDefault(); window.location.href='/login'; }} 
                    className="btn btn-info">
                    Login
                  </button>;

      signUpLink = <button 
                    onClick={(e) => {  e.preventDefault(); window.location.href='/signup'; }} 
                    className="btn btn-success">
                    Sign Up
                  </button>;

    } else {
     loginLink = <button 
                    onClick={logout} 
                    className="btn btn-info">
                    Logout
                  </button>;
    
    signUpLink = <button 
                  onClick={(e) => {  e.preventDefault(); window.location.href='/login'; }} 
                  className="btn btn-success">
                  My Profile
                </button>;
    }


    return (
        <Router>
        <div className="container">
            <div className="row">&nbsp;</div>
              <div className="row">
                <div className='col-md-2 logo hidden-xs'>
                   <button className="btn btn-info">BETA VERSION</button>
                </div>
                <div className='col-md-8' style={{ fontSize:"24px", fontFamily:"monospace", fontWeight:400, textAlign:"center" }}>
                  WELCOME TO RECRUITER VERIFICATION SEARCH
                </div>
                <div className='col-md-2'>
                  <div className="col mt-3 text-end">{signUpLink} {loginLink}</div>
                </div>
            </div>
            <div className="row">
              <div className="col-md-2">
              <nav>
                <ul className="list-group">
                  <li className="list-group-item">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="list-group-item">
                    <Link to="/recruiters">Recruiters</Link>
                  </li>
                  <li className="list-group-item">
                    <Link to="/genres">Genres</Link>
                  </li>
                  {jwt !== "" && (
                    <Fragment>
                      <li className="list-group-item">
                        <Link to="/admin/recruiter/0">Add Recruiter</Link>
                      </li>
                      <li className="list-group-item">
                        <Link to="/admin">Manage Catalogue</Link>
                      </li>
                    </Fragment>
                  )}
                  <li className="list-group-item">
                    <Link to="/graphql">GraphQL</Link>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="col-md-10">
              <Switch>
                <Route path="/recruiter/:id" component={Recruiter} />

                <Route path="/recruiters">
                  <Recruiters />
                </Route>

                <Route path="/genre/:id" component={Genre} />

                <Route
                  exact
                  path="/login"
                  component={(props) => (
                    <Login {...props} handleJWTChange={handleJWTChange} />
                  )}
                />

                <Route exact path="/genres">
                  <Genres />
                </Route>

                <Route exact path="/graphql">
                  <GraphQL />
                </Route>

                <Route
                  path="/admin/recruiter/:id"
                  component={(props) => (
                    <EditRecruiter {...props} jwt={jwt} />
                  )}
                />

                <Route
                  path="/admin"
                  component={(props) => (
                    <Admin {...props} jwt={jwt} />
                  )}
                />

                <Route path="/">
                  <Home />
                </Route>
              </Switch>
            </div>
          </div>

          <div className="row">&nbsp;</div>
        </div>
      </Router>
    );
}

export default App;