import React, { useState } from 'react';
import styled from '@emotion/styled';
import {
  Card, CardActions, CardContent, InputAdornment, TextField,
} from '@mui/material';
import Button from '@mui/material/Button';
import { useQuery } from 'react-query';
import { Scrollbars } from 'react-custom-scrollbars-2';
import Search from '@mui/icons-material/Search';
import Fuse from 'fuse.js';
import { fetchNui } from '../../utils/fetchNui';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 15px;
  
  padding: 10px;
  padding-top: 0px;
  
  max-width: 1600px;
  margin: 0 auto;
`;

async function fetchRikosnimikkeet() {
  return fetchNui('rikosnimikkeet');
}

interface Rikosfetch {
  res: {
      data: {id: number, nimike: string, kuvaus: string, sakko: number, kategoria: number}[]
  }
}

interface RikosnimikkeetProps {
  addMode: boolean
  addNimike?: (data: any) => void
}

const Rikosnimikkeet = ({ addMode = false, addNimike }: RikosnimikkeetProps) => {
  const { data, isLoading } = useQuery<Rikosfetch>('rikosnimikkeet', fetchRikosnimikkeet);
  const [query, updateQuery] = useState('');
  const nimikkeet = data?.res?.data;

  if (!nimikkeet) return null;

  const fuse = new Fuse(nimikkeet, {
    keys: [
      {
        name: 'nimike',
        weight: 2,
      },
      'kuvaus',
      'sakko',
    ],
    includeScore: true,
    threshold: 0.2,
  });

  const results = fuse.search(query);
  const characterResults = query ? results.map((nimike) => nimike.item) : nimikkeet;

  return (
    <div style={{
      width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', height: '100%',
    }}
    >
      {isLoading && <h1>lataa</h1>}
      <TextField
        style={{ marginTop: 10, marginRight: 20, marginBottom: 10 }}
        value={query}
        onChange={(e) => updateQuery(e.target.value)}
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
      />
      <Scrollbars
        autoHide
        autoHideTimeout={1000}
        autoHideDuration={200}
        height="100%"
      >
        <Grid>
          {!isLoading && characterResults.map((rikos) => (
            <Card
              style={{
                background: 'rgb(0 0 0 / 25%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}
              key={rikos.id}
            >
              <CardContent>
                <h1 style={{ margin: 0, fontSize: 20 }}>{rikos.nimike}</h1>
                <p style={{ margin: 0, marginTop: 2 }}>
                  {rikos.kuvaus}
                </p>
                <p style={{ margin: 0, marginTop: 2 }}>
                  {rikos.sakko}
                  {' '}
                  €
                </p>
              </CardContent>
              {addMode && (
                <CardActions>
                  <Button variant="outlined" onClick={() => (addNimike ? addNimike(rikos) : null)}>Lisää</Button>
                </CardActions>
              )}
            </Card>
          ))}

        </Grid>
      </Scrollbars>
    </div>
  );
};

export default Rikosnimikkeet;
