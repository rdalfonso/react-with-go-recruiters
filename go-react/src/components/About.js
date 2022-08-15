import React from 'react';
import Ticket from "./../images/rr.jpg";
import styled from 'styled-components';

const BaseStyle = styled.div`
   font-size: 14px;
   width:"70%";
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


const About = () => {
    return (
    <BaseStyle>
        <div>
            <div><h3>Most online recruiters are dishonest or fake.</h3></div>
            <div><b>Don't get burned. Reduce spam. Less harassment.</b></div>
            <div> 
                <img 
                    height="300px"
                    width="500px"
                    src={Ticket} 
                    alt="recruiter images" 
                />
            </div>
            <div>
                <div>
                <h3>Trusted Reviews by real engineers</h3>
                <BetaButton>Industry Peers</BetaButton>&nbsp;
                <LoginButton>Honest Reviews</LoginButton> &nbsp;
                <SignupButton>Valuble Information</SignupButton> &nbsp;
                </div>
            </div>
        </div>
    </BaseStyle>
)
}

export default About;