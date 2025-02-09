import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { picturesSelector, getSelectedPicture } from '../reducer';
import Modal from './modal';
import { isSome } from 'fp-ts/Option';
import { RootState } from '../store';

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

const Message = styled.p`
  text-align: center;
  font-size: 18px;
  color: grey;
`;

const Author = styled.p`
  text-align: center;
  font-size: 14px;
  color: grey;
  margin-top: 5px;
`;

const Pictures = () => {
  const dispatch = useDispatch();
  const selectedPicture = useSelector(getSelectedPicture);
  const picturesState = useSelector((state: RootState) => state.pictures);
  if (picturesState.status === 'loading') {
    return <Message>Chargement...</Message>;
  }

  if (picturesState.status === 'failure') {
    return <Message>Erreur : {picturesState.error}</Message>;
  }
  return (
    <Container>
      {picturesState.status === 'success' &&
        picturesState.pictures.map((picture, index) => (
          <div key={index} style={{ textAlign: 'center', margin: '10px' }}>
          <Image 
            src={picture.previewFormat} 
            alt={`Cat ${index}`} 
            onClick={() => dispatch({ type: 'SELECT_PICTURE', picture })}
          />
          <Author>{picture.author}</Author>
        </div>
      ))}
      {isSome(selectedPicture) && <Modal />}
    </Container>
  );
};

export default Pictures;
