import React, { useState, useEffect, Fragment } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Admin from "./components/Admin";
//import Home from "./components/Home";
//import About from "./components/About";

import GraphQL from "./components/GraphQL";
import Recruiters from "./components/Recruiters";
import Genres from "./components/Genres";
import Recruiter from "./components/Recruiter";
import Genre from "./components/Genre";
import EditRecruiter from "./components/EditRecruiter";
import styled from 'styled-components';

const BaseStyle = styled.div`
   font-size: 14px;
   width:"70%";
`;

const SideBar = styled.div`
  width:250px;
  margin-right:60px;
`;

const HeaderStyle = styled.div`
   display: flex;
   justify-content: space-between;
   flex-direction: row;
   padding:20px;
`;

const BodyStyle = styled.div`
   display: flex;
   justify-content: start;
   flex-direction: row;
   padding:20px;
`;

const MainStyle = styled.div`
  width:60%;
`;

const ListItem = styled.li`
  position: relative;
  display: block;
  padding: 0.5rem 1rem;
  color: #212529;
  text-decoration: none;
  background-color: #fff;
  border: 1px solid rgba(0,0,0,.125);
`;


const BetaButton = styled.button`
  width:140px;
  color: white;
  background-color: #0dcaf0;
  border-color: #0dcaf0;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  border-radius: 0.25rem;
`;

const LoginButton = styled.button`
  width:80px;
  color: white;
  background-color: #0dcaf0;
  border-color: #0dcaf0;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  border-radius: 0.25rem;
`;

const SignupButton = styled.button`
  width:120px;
  color: white;
  background-color: green;
  border-color: green;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  border-radius: 0.25rem;
`;

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
      loginLink = <LoginButton onClick={(e) => {  e.preventDefault(); window.location.href='/login'; }} >
                    Login
                  </LoginButton>;

      signUpLink = <SignupButton onClick={(e) => {  e.preventDefault(); window.location.href='/signup'; }}>
                    Sign Up
                  </SignupButton>;

    } else {
     loginLink = <LoginButton onClick={logout} >Logout</LoginButton>;
    
     signUpLink = <SignupButton onClick={(e) => {  e.preventDefault(); window.location.href='/login'; }}>
                  My Profile
                </SignupButton>;
    }


    return (
      <Router>
        <BaseStyle>
              <HeaderStyle>
                <div>
                   <BetaButton>BETA VERSION</BetaButton>
                </div>
                <div  style={{ fontSize:"24px", fontFamily:"monospace", fontWeight:400, textAlign:"center" }}>
                  WELCOME TO RECRUITER VERIFICATION SEARCH
                </div>
                <div>
                   <div>{signUpLink} {loginLink}</div>
                </div>
            </HeaderStyle>
            <BodyStyle>
              <SideBar>
                <nav>
                <ul className="list-group">
                  <ListItem>
                    <Link to="/">Home</Link>
                  </ListItem>
                  <ListItem>
                    <Link to="/recruiters">Recruiters</Link>
                  </ListItem>
                  <ListItem>
                    <Link to="/genres">Genres</Link>
                  </ListItem>
                  {jwt !== "" && (
                    <Fragment>
                      <ListItem>
                        <Link to="/admin/recruiter/0">Add Recruiter</Link>
                      </ListItem>
                      <ListItem>
                        <Link to="/admin">Manage Catalogue</Link>
                      </ListItem>
                    </Fragment>
                  )}
                  <ListItem>
                    <Link to="/graphql">GraphQL</Link>
                  </ListItem>
                </ul>
              </nav>
            </SideBar>

            <MainStyle>
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
                  <GraphQL />
                </Route>
              </Switch>
            </MainStyle>
          </BodyStyle>
        </BaseStyle>
      </Router>
    );
}

export default App;