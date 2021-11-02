/* eslint-disable import/no-duplicates */
import React, { ChangeEvent, useRef, useState } from 'react';
import styled from '@emotion/styled';
import {
  Card, CardContent, CircularProgress, InputAdornment, TextField,
} from '@mui/material';
import { useHistory } from 'react-router-dom';
import Search from '@mui/icons-material/Search';
import fi from 'date-fns/locale/fi';
import { formatDistance } from 'date-fns';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { useMutation, useQuery } from 'react-query';
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

const GridItem = styled.div`
  background: #18191f;
  padding: 10px 15px;
  height: 50px;
  
  display: flex;
  flex-direction: column;
  
  cursor: pointer;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  
  & :last-child {
    margin-top: auto;
  }
`;

const ItemGrid = styled.div`
  display: flex;
  flex-direction: row;
`;

const Text = styled.span`
  display: inline-block;
  width: 500px;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
`;

async function mutateTapahtuma(data: {hakusana: string, osoite: string}) {
  return fetchNui(data.osoite, data);
}

interface Items {
  name: string
  id: number
  timestamp: number
}

function fetchKuulutukset() {
  return fetchNui('etsintäkuulutukset');
}

type EtsintakuulutetutProps = {

}

const Etsintakuulutetut = () => {
  const history = useHistory();
  const [text, setText] = useState('');
  const { data } = useQuery('etsintäkuulutukset', fetchKuulutukset);
  const [ref, {
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

  console.log({ data });

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
          {kuulutukset.map((i: any) => (
            <Card onClick={() => history.push(`/raportit/${i.tid}`)} key={i.id} style={{ cursor: 'pointer' }}>
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
                      Vanhenee:
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
          ))}
        </Grid>

      </Scrollbars>
      {/* </div> */}
    </Container>
  );
};

export default Etsintakuulutetut;
