
import React from 'react'
import styled from 'styled-components';

const BaseStyle = styled.div`
   font-size: 14px;
   width:"70%";
`;

const OtherComponent = (props) => {
  return <BaseStyle>Rendering a bit late</BaseStyle>
};

export default OtherComponent;