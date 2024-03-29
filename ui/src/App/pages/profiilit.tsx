import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { LinearProgress, linearProgressClasses } from '@mui/material';
import SearchList from '../components/SearchList';
import { fetchNui } from '../../utils/fetchNui';
import ErrorBoundary from '../../ErrorBoundary';
import Profile from '../components/Profile';
import ProfileInfo from '../components/ProfileInfo';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
  
  height: 100%;
`;

async function fetchProfiilit() {
  return fetchNui('profiilit');
}

async function getProfiili(data: any) {
  return fetchNui('profiilit', { id: data });
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }: any) => ({
  height: 10,
  borderRadius: 3,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}));

const Profiilit = () => {
  const { data, isSuccess, isError } = useQuery('profiilit', fetchProfiilit);
  const { id } = useParams<{id?: string}>();
  const {
    data: profiili, isLoading, isError: err, refetch,
  } = useQuery(['profiili', id], () => getProfiili(id), {
    enabled: !!id,
  });
  // const {
  //   mutate, isSuccess: success, data: profiili, isLoading, isError: err,
  // } = useMutation(['profiili', id], getProfiili);

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id]);

  return (
    <ErrorBoundary>
      <div style={{ padding: '10px' }}>
        <Grid>
          {isSuccess && (
            <SearchList osoite="haerikollisia" name="Profiilit" showTimestamp={false} items={data.res.data} />
          )}
          {id ? (
            <>
              {!isLoading ? (
                <>
                  <Profile isCreate={false} profileData={profiili.res.data[0]} />
                  <ProfileInfo id={profiili.res.data[0].id} profileData={profiili} />
                </>
              ) : (
                <div style={{ position: 'relative' }}>
                  <BorderLinearProgress style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '8px', zIndex: 231,
                  }}
                  />
                  <Profile
                    isCreate={false}
                    profileData={{
                      name: '',
                      image: '',
                      id: '',
                      description: '',
                    }}
                  />
                </div>
              )}

            </>
          ) : (
            <Profile
              isCreate
              profileData={{
                name: '',
                image: 'https://images.theconversation.com/files/229852/original/file-20180730-106514-1tfe2rs.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=926&fit=clip',
                id: '',
                description: '',
              }}
            />
          )}
          {(isError ?? err) && (
            <h1>virhe</h1>
          )}
        </Grid>
      </div>
    </ErrorBoundary>
  );
};

export default Profiilit;
