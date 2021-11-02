/* eslint-disable import/no-duplicates */
import React, { ChangeEvent, useState } from 'react';
import styled from '@emotion/styled';
import {
  Card, CardContent, InputAdornment, TextField,
} from '@mui/material';
import { useHistory } from 'react-router-dom';
import Search from '@mui/icons-material/Search';
import fi from 'date-fns/locale/fi';
import { formatDistance, isPast } from 'date-fns';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { useQuery } from 'react-query';
// @ts-ignore
import useDimensions from 'react-use-dimensions';
import Fuse from 'fuse.js';
import { fetchNui } from '../../utils/fetchNui';

const Container = styled.div`
  background: #2a3c52;
  padding: 10px;
  position: relative;
  
  display: grid;
  grid-template-rows: auto 1fr;
`;

const InfoBar = styled.div`
  margin-bottom: 10px;
  
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  & :last-child {
    margin-left: auto;
  }
  
`;

const Grid = styled.div`
  display: grid;
  grid-template-rows: repeat(auto-fill, 1fr);
  grid-gap: 10px;
`;

function fetchKuulutukset() {
  return fetchNui('etsintäkuulutukset');
}

const Etsintakuulutetut = () => {
  const history = useHistory();
  const [text, setText] = useState('');
  const { data } = useQuery('etsintäkuulutukset', fetchKuulutukset);
  const [, {
    width,
  }] = useDimensions();

  const textChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const fuse = new Fuse(data?.res.data ?? [], {
    keys: [
      {
        name: 'name',
        weight: 2,
      },
      'cid',
    ],
    includeScore: true,
    threshold: 0.2,
  });

  const results = fuse.search(text);
  const kuulutukset = text ? results.map((nimike) => nimike.item) : (data?.res.data ?? []);

  return (
    <Container style={{ width }}>
      {/* {isLoading && ( */}
      {/* <BorderLinearProgress style={{ */}
      {/*   position: 'absolute', top: 0, left: 0, width: '100%', height: '8px', */}
      {/* }} */}
      {/* /> */}
      {/* )} */}
      <InfoBar>
        <span>
          Etsintäkuulutukset:
        </span>
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          id="search"
          label="Haku"
          variant="standard"
          onChange={textChange}
          value={text}
        />
      </InfoBar>
      <Scrollbars
        autoHide
        autoHideTimeout={1000}
        autoHideDuration={200}
        height="100%"
        width={width}
      >
        <Grid>
          {!kuulutukset[0] && (
            <Card style={{ background: '#313b4e' }}>
              <CardContent>
                <p>Ei aktiivisia etsintäkuulutuksia</p>
              </CardContent>
            </Card>
          )}
          {kuulutukset.map((i: any) => {
            const inPast = isPast(new Date(i.expires));

            return (
              <Card onClick={() => history.push(`/raportit/${i.tid}`)} key={i.id} style={{ background: '#232a36', cursor: 'pointer', opacity: inPast ? 0.35 : 1 }}>
                <CardContent>
                  <div style={{ display: 'flex', gap: 15 }}>
                    <img style={{ maxWidth: 125 }} alt="kuva" src={i.image ?? 'https://images.theconversation.com/files/229852/original/file-20180730-106514-1tfe2rs.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=926&fit=clip'} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <h1 style={{ margin: 0, fontSize: 20 }}>{i.name}</h1>
                      <p style={{ margin: 0, marginTop: 2 }}>
                        ID:
                        {' '}
                        {i.cid}
                      </p>

                      <p style={{ margin: 0, marginTop: 'auto' }}>
                        Vanhenee
                        {' '}
                        {formatDistance(
                          new Date(i.expires),
                          new Date(),
                          { locale: fi, addSuffix: true },
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </Grid>

      </Scrollbars>
      {/* </div> */}
    </Container>
  );
};

export default Etsintakuulutetut;
