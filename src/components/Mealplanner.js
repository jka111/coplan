import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import Confetti from 'react-confetti';

const StyledBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 100%;
`;

const FoodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
  padding: 0 10px;
`;

const FoodCard = styled.div`
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  text-align: center;
  padding: 10px;
  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: scale(1.05);
  }
  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 100%;
  margin-bottom: 20px;
`;

const ShoppingList = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  margin-top: 20px;
  width: 100%;
  max-width: 800px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #45a049;
  }
`;

// Hovedkomponent for måltidsplanleggeren
const MealPlanner = () => {
  const [foods, setFoods] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [days, setDays] = useState(2);
  const [persons, setPersons] = useState(1); // Antall personer for måltidsplanen
  const [mealPlan, setMealPlan] = useState([]);
  const [shoppingList, setShoppingList] = useState({});
  const [confetti, setConfetti] = useState(false);

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
    setConfetti(true);
    setTimeout(() => setConfetti(false), 2000);

    alert("Din måltidsplan er generert, bla ned for å se!");
  };

  // Justerer ingredienser basert på antall personer
  const generateShoppingList = (selectedMeals) => {
    const list = {};
    selectedMeals.forEach(meal => {
      meal.ingredients.forEach(({ ingredient, amount, unit }) => {
        const key = `${ingredient} (${unit})`;
        const numAmount = parseFloat(amount) * persons; // Ganger med antall personer
        if (!isNaN(numAmount)) {
          if (list[key]) {
            list[key] += numAmount;
          } else {
            list[key] = numAmount;
          }
        }
      });
    });
    const formattedList = {};
    Object.keys(list).forEach(key => {
      formattedList[key] = Number(list[key]);
    });
    setShoppingList(formattedList);
  };

  if (!foods.length) {
    return <StyledBox>Loading...</StyledBox>;
  }
  const removeAndReplaceMeal = (mealId) => {
    setMealPlan(prev => {
      const remainingMeals = prev.filter(meal => meal.id !== mealId);
      const availableFoods = foods.filter(food => !remainingMeals.find(m => m.id === food.id));
      const newMeal = availableFoods[Math.floor(Math.random() * availableFoods.length)];

      if (newMeal) {
        remainingMeals.push(newMeal); // Add the new meal
        generateShoppingList(remainingMeals); // Recalculate the shopping list with the new meal
      }

      return remainingMeals;
    });
  };

  if (!foods.length) {
    return <StyledBox>Loading...</StyledBox>;
  }
  return (
    <StyledBox>
      {confetti && <Confetti />}
      <InputContainer>
        <label htmlFor="days">Velg antall dager for måltidsplan:</label>
        <input
          id="days"
          type="number"
          value={days}
          onChange={e => setDays(Math.max(2, Math.min(7, parseInt(e.target.value))))}
        />
        <label htmlFor="persons">Antall personer:</label>
        <input
          id="persons"
          type="number"
          min="1"
          value={persons}
          onChange={e => setPersons(Math.max(1, parseInt(e.target.value)))} // Sikrer at minimum 1 person er valgt
        />
        <Button onClick={generateMealPlan}>Generer måltidsplan</Button>
      </InputContainer>
      <FoodGrid>
        {foods.map(food => (
          <FoodCard key={food.id} onClick={() => handleFoodSelection(food.id)}>
            <img src={food.imageUrl} alt={food.name} />
            <h3>{food.name}</h3>
            <input
              type="checkbox"
              checked={selectedFoods.includes(food.id)}
              onChange={() => handleFoodSelection(food.id)}
            />
          </FoodCard>
        ))}
      </FoodGrid>
      <h3>Din måltidsplan:</h3>
      {mealPlan.length > 0 && (
        <FoodGrid>
          
          
          {mealPlan.map(food => (
            <FoodCard key={food.id}>
              <img src={food.imageUrl} alt={food.name} />
              <h3>{food.name}</h3>
              <Button onClick={() => removeAndReplaceMeal(food.id)}>Bytt ut</Button>
              <Link to={`/${food.id}`}>
                <Button>Les mer om {food.name}</Button>
              </Link>
            
            </FoodCard>
          ))}
        </FoodGrid>
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
