import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

const StyledBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const FoodCard = styled.div`
  width: 100%;
  max-width: 300px;
  height: 350px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  text-align: center;
  padding: 10px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &:hover {
    transform: scale(1.02);
    transition: transform 0.2s ease-in-out;
  }
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const ShoppingList = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  margin-top: 20px;
  width: 100%;
  max-width: 600px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #45a049;
  }
`;

const MealPlanner = () => {
  const [foods, setFoods] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [days, setDays] = useState(2);
  const [mealPlan, setMealPlan] = useState([]);
  const [shoppingList, setShoppingList] = useState({});

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'foods'));
      const fetchedFoods = [];
      querySnapshot.forEach((doc) => {
        const food = { ...doc.data(), id: doc.id };
        fetchedFoods.push(food);
      });
      setFoods(fetchedFoods);
      setSelectedFoods(fetchedFoods.map(food => food.id));
    } catch (error) {
      console.error("Error fetching food data:", error);
    }
  };

  const handleFoodSelection = (id) => {
    setSelectedFoods(prev => prev.includes(id) ? prev.filter(foodId => foodId !== id) : [...prev, id]);
  };

  const generateMealPlan = () => {
    const filteredFoods = foods.filter(food => selectedFoods.includes(food.id));
    const shuffled = filteredFoods.sort(() => 0.5 - Math.random());
    setMealPlan(shuffled.slice(0, days));
    generateShoppingList(shuffled.slice(0, days));
  };

  const generateShoppingList = (selectedMeals) => {
    const list = {};
    selectedMeals.forEach(meal => {
      meal.ingredients.forEach(({ ingredient, amount, unit }) => {
        const key = `${ingredient} (${unit})`;
        if (list[key]) {
          list[key] += parseFloat(amount);
        } else {
          list[key] = parseFloat(amount);
        }
      });
    });
    setShoppingList(list);
  };

  if (!foods.length) {
    return <StyledBox>Loading...</StyledBox>;
  }

  return (
    <StyledBox>
      <InputContainer>
        <label htmlFor="days">Velg antall dager for måltidsplan:</label>
        <input
          id="days"
          type="number"
          value={days}
          onChange={e => setDays(Math.max(2, Math.min(7, parseInt(e.target.value))))}
        />
        <Button onClick={generateMealPlan}>Generer måltidsplan</Button>
      </InputContainer>
      <div>
        <h3>Velg måltider du ønsker i din plan:</h3>
        {foods.map(food => (
          <FoodCard key={food.id} onClick={() => handleFoodSelection(food.id)}>
            <img src={food.imageUrl} alt={food.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <h3>{food.name}</h3>
            <input
              type="checkbox"
              checked={selectedFoods.includes(food.id)}
              onChange={() => handleFoodSelection(food.id)}
            />
          </FoodCard>
        ))}
      </div>
      {mealPlan.length > 0 && (
        <div>
          <h3>Din måltidsplan:</h3>
          {mealPlan.map(food => (
            <FoodCard key={food.id}>
              <img src={food.imageUrl} alt={food.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <h3>{food.name}</h3>
              <Link to={`/${food.id}`}><Button>Les mer om {food.name}</Button></Link>
            </FoodCard>
          ))}
        </div>
      )}
      <ShoppingList>
        <h3>Handleliste:</h3>
        <ul>
          {Object.entries(shoppingList).map(([item, quantity]) => (
            <li key={item}>{`${quantity} ${item}`}</li>
          ))}
        </ul>
      </ShoppingList>
    </StyledBox>
  );
};

export default MealPlanner;
