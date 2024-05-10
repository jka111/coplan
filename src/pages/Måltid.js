import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import styled from 'styled-components';

// Styled components for better visual display
const FoodContainer = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
`;

const FoodTitle = styled.h2`
  font-size: 24px;
  color: #333;
`;

const FoodImage = styled.img`
  width: 100%;
  height: auto;
  margin-top: 20px;
`;

const FoodDescription = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.5;
`;

const IngredientList = styled.ul`
  list-style: none;
  padding: 0;
`;

const IngredientItem = styled.li`
  margin-bottom: 10px;
  font-size: 16px;
`;

function Måltid() {
  const { foodId } = useParams();
  const [food, setFood] = useState(null);

  useEffect(() => {
    async function fetchFood() {
      const docRef = doc(db, 'foods', foodId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setFood(docSnap.data());
      } else {
        console.log("No such document!");
      }
    }

    fetchFood();
  }, [foodId]);

  if (!food) {
    return <p>Loading...</p>;
  }

  return (
    <FoodContainer>
      <FoodTitle>{food.name}</FoodTitle>
      <FoodImage src={food.imageURL} alt={food.name} />
      {food.description && <FoodDescription>{food.description}</FoodDescription>}
      
      <h3>Ingredients</h3>
      <IngredientList>
        {food.ingredients.map((ingredient, index) => (
          <IngredientItem key={index}>
            {ingredient.ingredient} - {ingredient.amount} {ingredient.unit}
          </IngredientItem>
        ))}
      </IngredientList>
    </FoodContainer>
  );
}

export default Måltid;
