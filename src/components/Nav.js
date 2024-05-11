import React from 'react';
import { Link } from "react-router-dom";
import styled from 'styled-components';

export default function Nav() {
  return (
    <StyledDiv>
      <StyledLink to="/">LOGO</StyledLink>   {/* byttes med bilde */}
      <div>
        <StyledLink to="/måltider">Måltider</StyledLink>
        <StyledLink to="/om">Om Cooplanner</StyledLink>
        <StyledLink to="/mealplanner">Mealplanner</StyledLink> {/* Ny fane */}
      </div>
    </StyledDiv>
  );
}

// Style for the navigation container
const StyledDiv = styled.div`
  display: flex;
  background-color: #333;   
  color: white;
  height: 60px;
  align-items: center;
  justify-content: space-between;  // This will spread out the logo and links
  padding: 0 20px;                // Add padding on the sides
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);  // Optional: adds shadow for a bit of depth
`;

// Style for the links to remove default styling and add custom styling
const StyledLink = styled(Link)`
  color: white;                // Sets the text color to white
  text-decoration: none;       // Removes underline from links
  margin-right: 20px;          // Adds spacing between the links

  &:hover {
    color: #ddd;               // Lighter color on hover for better interactivity
  }
`;
