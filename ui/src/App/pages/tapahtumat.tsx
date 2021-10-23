import React from 'react';
import styled from '@emotion/styled';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import SearchList from '../components/SearchList';
import Case from '../components/Case';
import Rikollinen from '../components/Rikollinen';
import { fetchNui } from '../../utils/fetchNui';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
  
  padding: 10px;
`;

async function fetchTapahtumat() {
  return fetchNui('tapahtumat');
}

export interface ICase {
  id: number
  name: string
  description: string
  timestamp: Date
  rikolliset: any
  data: any
}

const Tapahtumat = () => {
  const { data, isSuccess, isError } = useQuery('tapahtumat', fetchTapahtumat);
  const { id } = useParams<{id?: string}>();

  const activeCase = data?.res?.data.filter((a: ICase) => a.id == Number(id))[0];

  return (
    <div>
      <Grid>
        {isSuccess && (
          <SearchList name="Tapahtumat" items={data.res.data} />
        )}
        {isError && (
          <h1>virhe</h1>
        )}
        {id && (
          <>
            <Case name={data.res.data.name} caseData={activeCase} id={id} />
            <Rikollinen caseData={activeCase} id={id} />
          </>
        )}
      </Grid>
    </div>
  );
};

export default Tapahtumat;
