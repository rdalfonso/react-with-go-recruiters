import React from 'react';
import Ticket from "./../images/rr.jpg";
import styled from 'styled-components';

const BaseStyle = styled.div`
   font-size: 14px;
   width:"70%";
`;

const Home = () => {
    return (
    <BaseStyle>
        <div>
            <div className="row"><h3>Most online recruiters are dishonest or fake.</h3></div>
            <div className="row"><b>Don't get burned. Reduce spam. Less harassment.</b></div>
            <div className="row"> 
                <img 
                height="300px"
                width="500px"
                    src={Ticket} 
                    alt="recruiter images" />
            </div>

            <div className="row">&nbsp;</div>

            <div className="row">
                <div className="col-md-3" >&nbsp;</div>
                <div className="col-md-9">
                <h3>Trusted Reviews by real engineers</h3>
                <button className="btn btn-success footer-button">Industry Peers</button>&nbsp;
                <button className="btn btn-primary footer-button">Honest Reviews</button> &nbsp;
                <button className="btn btn-info footer-button">Valuble Information</button> &nbsp;
                </div>
            </div>
        </div>
    </BaseStyle>
)
}

export default Home;