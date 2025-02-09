import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { picturesSelector } from '../reducer';

const Container = styled.div`
  padding: 1rem;
  justify-content: center;
  display: flex;
  flex-wrap: wrap;
`;

const Image = styled.img`
  margin: 10px;
  object-fit: contain;
  transition: transform 1s;
  max-width: fit-content;
  &:hover {
    transform: scale(1.2);
  }
`;
const Pictures = () => {
  const pictures = useSelector(picturesSelector);
  const dispatch = useDispatch();

  return (
    <Container>
      {pictures.map((picture, index) => (
        <Image 
          key={index} 
          src={picture.previewFormat} 
          alt={`Cat ${index}`} 
          onClick={() => dispatch({ type: 'SELECT_PICTURE', picture })}
        />
      ))}
    </Container>
  );
};

export default Pictures;
