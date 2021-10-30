import React from 'react';
import styled from '@emotion/styled';
import SearchList from '../components/SearchList';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
  
  padding: 10px;
`;

const DemoItems = [
  {
    name: 'Nimi tossa ja testi tässä',
    id: 1,
    timestamp: 1635000217565,
  },
  {
    name: 'Hirveän pitkä teksti tämä on pitkähän tämä on että joku vammainen kirjoittaa näin pitkän tekstin koska he ovat vammaisia',
    id: 2,
    timestamp: 1634000217565,
  },
];

const Etusivu = () => (
  <div>
    <Grid>
      <SearchList name="Testi lista" items={DemoItems} />

      <h1>HÖÖÖHÖÖÖ ETUSIVU TÄMÄ ON ETUSIVU </h1>
    </Grid>
  </div>
);

export default Etusivu;
