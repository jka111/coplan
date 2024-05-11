import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import {  Link } from 'react-router-dom';

export default function Home() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'foods'));
        const foodData = [];
        querySnapshot.forEach((doc) => {
          foodData.push({ ...doc.data(), id: doc.id });
        });
        setFoods(foodData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching food data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <StyledBox>Loading...</StyledBox>; // Displays while data is being fetched
  }

  if (foods.length === 0) {
    return <StyledBox>Det finnes ingen mat i databasen.</StyledBox>; // Message when no food data exists
  }

  return (
    <StyledBox>
      {foods.map(food => (
        <FoodCard key={food.id}>
          <img src={food.imageUrl} alt={food.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
          <h3>{food.name}</h3>
          <Link to={`/${food.id}`}><button className='btn btn-success seMer'>Les mer om {food.name}</button></Link>
        </FoodCard>
      ))}
    </StyledBox>
  );
}

const StyledBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  padding: 20px;
`;

const FoodCard = styled.div`
  width: 300px;
  height: 300px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  text-align: center;
  padding: 10px;
  &:hover {
    transform: scale(1.05);
    transition: transform 0.2s ease-in-out;
  }
`;
