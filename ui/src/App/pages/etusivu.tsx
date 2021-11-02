import React from 'react';
import styled from '@emotion/styled';
import { useQuery } from 'react-query';
import SearchList from '../components/SearchList';
import { fetchNui } from '../../utils/fetchNui';
import Etsintakuulutetut from '../components/Etsintakuulutetut';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
  
  padding: 10px;
`;

const Container = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  position: relative; 
  
  & > * {
    border-radius: 2px;
  }
`;

const InfoBar = styled.div`
  margin-bottom: 10px;
  
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  
`;

const TextContainer = styled.div`
  background: #2a3c52;
  padding: 10px;
`;

async function fetchTapahtumat() {
  return fetchNui('tapahtumat', {}, true);
}

const Etusivu = () => {
  const {
    data, isSuccess,
  } = useQuery('tapahtumat', fetchTapahtumat);

  return (
    <Grid>
      {isSuccess && (
      <SearchList osoite="haeraportteja" name="Raportit" items={data.res.data} />
      )}

      <Etsintakuulutetut />

      {/* <Container> */}
      {/*  <TextContainer> */}
      {/*    <InfoBar> */}
      {/*      <span>Etsintäkuulutukset:</span> */}
      {/*    </InfoBar> */}
      {/*  </TextContainer> */}
      {/* </Container> */}

      <Container>
        <TextContainer>
          <InfoBar>
            <span>Ilmoitukset:</span>
          </InfoBar>
        </TextContainer>
      </Container>
    </Grid>
  );
};

export default Etusivu;
