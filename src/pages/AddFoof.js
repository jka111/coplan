import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import styled from 'styled-components';

// Styled components
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
`;

const StyledLabel = styled.label`
  margin: 10px;
`;

const StyledInput = styled.input`
  margin: 5px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const StyledSelect = styled.select`
  margin: 5px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const StyledButton = styled.button`
  margin: 10px;
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

const IngredientWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px;
`;

const ImagePreview = styled.img`
  max-width: 100px;
  max-height: 100px;
  margin-top: 10px;
`;

export default function AddFoof() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [ingredients, setIngredients] = useState([{ ingredient: '', amount: '', unit: '' }]);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const handleIngredientChange = (index, event) => {
    const newIngredients = [...ingredients];
    newIngredients[index][event.target.name] = event.target.value;
    setIngredients(newIngredients);
  };

  const addIngredientField = () => {
    setIngredients([...ingredients, { ingredient: '', amount: '', unit: '' }]);
  };

  const removeIngredientField = (index) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!file) return;
    const storageRef = ref(storage, `foods/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        (snapshot) => {
          // Handle progress
        }, 
        (error) => {
          // Handle unsuccessful uploads
          reject(error);
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const imageUrl = await uploadImage();
    try {
      const docRef = await addDoc(collection(db, 'foods'), {
        name,
        category,
        difficulty,
        ingredients,
        imageUrl,
        timestamp: serverTimestamp(),
      });
      console.log('Document written with ID: ', docRef.id);
      alert('Food added successfully!');
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Error adding food');
    }
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <StyledLabel>
        Food Name:
        <StyledInput type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </StyledLabel>
      <StyledLabel>
        Category:
        <StyledSelect value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select a category</option>
          <option value="meat">Meat</option>
          <option value="fish">Fish</option>
          <option value="vegan">Vegan</option>
        </StyledSelect>
      </StyledLabel>
      <StyledLabel>
        Difficulty:
        <StyledSelect value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="">Select difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </StyledSelect>
      </StyledLabel>
      <StyledLabel>
        Upload Image:
        <StyledInput type="file" accept="image/*" onChange={handleImageChange} />
        {imageUrl && <ImagePreview src={imageUrl} alt="Preview" />}
      </StyledLabel>
      <div>
        <h4>Ingredients</h4>
        {ingredients.map((item, index) => (
          <IngredientWrapper key={index}>
            <StyledInput
              name="ingredient"
              type="text"
              placeholder="Ingredient"
              value={item.ingredient}
              onChange={(e) => handleIngredientChange(index, e)}
            />
            <StyledInput
              name="amount"
              type="text"
              placeholder="Amount"
              value={item.amount}
              onChange={(e) => handleIngredientChange(index, e)}
            />
            <StyledInput
              name="unit"
              type="text"
              placeholder="Unit"
              value={item.unit}
              onChange={(e) => handleIngredientChange(index, e)}
            />
            <StyledButton type="button" onClick={() => removeIngredientField(index)}>Remove</StyledButton>
          </IngredientWrapper>
        ))}
        <StyledButton type="button" onClick={addIngredientField}>Add Ingredient</StyledButton>
      </div>
      <StyledButton type="submit">Submit</StyledButton>
    </StyledForm>
  );
}
