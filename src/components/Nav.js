import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from "react-router-dom";
import { storage } from '../firebase'; // Import your firebase configurations
import { getDownloadURL, ref } from 'firebase/storage';

// Style for the navigation container
const StyledDiv = styled.div`
  display: flex;
  background-color: #002141;   
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

// Style for the logo image
const LogoImage = styled.img`
  height: 50px; // Adjust size as needed
`;

export default function Nav() {
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    const fetchLogoUrl = async () => {
      const logoRef = ref(storage, 'gs://cooplaner.appspot.com/Logo/DALL·E 2024-05-14 13.45.35 - Logo design for a meal planning app, based on the first logo from a previous set. The logo should convey a lively and vibrant atmosphere, featur.jpg'); // Path to your logo in Firebase Storage
      const url = await getDownloadURL(logoRef);
      setLogoUrl(url);
    };

    fetchLogoUrl();
  }, []);

  return (
    <StyledDiv>
      {logoUrl ? (
        <StyledLink to="/mealplanner">
          <LogoImage src={logoUrl} alt="" />
        </StyledLink>
      ) : (
        <StyledLink to="/">Loading Logo...</StyledLink>
      )}
      <div>
        <StyledLink to="/mealplanner">Mealplanner</StyledLink> {/* Ny fane */}
        <StyledLink to="/home">Home</StyledLink>
        <StyledLink to="/om">Om Cooplanner</StyledLink>
      </div>
    </StyledDiv>
  );
}