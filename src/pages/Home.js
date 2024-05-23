import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

const StyledBox = styled.div`
  display: flex;
  flex-direction: column;  // Changed to column to align elements vertically
  align-items: center;    // Center align the content
  padding: 20px;
  width: 100%;
`;

const FoodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
`;

const FoodCard = styled.div`
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  text-align: center;
  padding: 10px;
  &:hover {
    transform: scale(1.05);
    transition: transform 0.2s ease-in-out;
  }
  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
`;

const Title = styled.h2`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
  margin-top: 20px;  // Added margin for visual separation
  &:hover {
    background-color: #45a049;
  }
`;

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
      } catch ( error) {
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
      <FoodGrid>
        {foods.map(food => (
          <FoodCard key={food.id}>
            <img src={food.imageUrl} alt={food.name} />
            <h3>{food.name}</h3>
            <Link to={`/${food.id}`}>
              <button className='btn btn-success seMer'>Les mer om {food.name}</button>
            </Link>
          </FoodCard>
        ))}
      </FoodGrid>
      <Title>Generer din måltidsplan her</Title>
      <Link to="/mealplanner">
        <Button>Start Måltidsplanlegger</Button>
      </Link>
    </StyledBox>
  );
}