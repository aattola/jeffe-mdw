import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { CircularProgress, LinearProgress, linearProgressClasses } from '@mui/material';
import SearchList from '../components/SearchList';
import Case from '../components/Case';
import Rikollinen from '../components/Rikollinen';
import { fetchNui } from '../../utils/fetchNui';
import ErrorBoundary from '../../ErrorBoundary';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
  
  padding: 10px;
`;

async function fetchTapahtumat() {
  return fetchNui('tapahtumat', {}, true);
}

async function getTapahtumat(data: {id: string}) {
  return fetchNui('tapahtumat', data);
}

export interface ICase {
  id: number
  name: string
  description: string
  timestamp: Date
  rikolliset: any
  data: any
}

const Raportit = () => {
  const { data, isSuccess, isError } = useQuery('tapahtumat', fetchTapahtumat);
  const { id } = useParams<{id?: string}>();
  const {
    mutate, isSuccess: success, data: tapahtuma, isLoading,
  } = useMutation(['tapahtuma', id], getTapahtumat);

  useEffect(() => {
    if (id) {
      mutate({ id });
    }
  }, [id]);

  return (
    <ErrorBoundary>
      <Grid>
        {isSuccess && (
          <>
            <SearchList name="Raportit" items={data.res.data} />
            {id && (
              <>
                {success ? (
                  <>
                    {tapahtuma.res.data[0] ? (
                      <>
                        <Case loading={false} name={data.res.data.name} caseData={tapahtuma.res.data[0]} id={id} />
                        <Rikollinen caseData={tapahtuma.res.data[0]} id={id} />
                      </>
                    ) : (
                      <h1>Huijaatko koska tuommoisella id:llä ei löydy mitään???</h1>
                    )}
                  </>
                ) : (
                  <Case
                    name=""
                    loading
                    caseData={{
                      id: 1,
                      name: 'Ladataan',
                      description: '...',
                      data: '{}',
                      rikolliset: '{}',
                      timestamp: (Date.now() as any),
                    }}
                    id={id}
                  />

                )}
              </>
            )}
          </>
        )}
        {isError && (
          <h1>virhe</h1>
        )}
      </Grid>
    </ErrorBoundary>
  );
};

export default Raportit;
