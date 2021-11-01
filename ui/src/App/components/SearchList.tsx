/* eslint-disable import/no-duplicates */
import React, { ChangeEvent, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { CircularProgress, InputAdornment, TextField } from '@mui/material';
import { useHistory } from 'react-router-dom';
import Search from '@mui/icons-material/Search';
import fi from 'date-fns/locale/fi';
import { formatDistance } from 'date-fns';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { useMutation } from 'react-query';
// @ts-ignore
import useDimensions from 'react-use-dimensions';
import { fetchNui } from '../../utils/fetchNui';
import { BorderLinearProgress } from './Case';

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

type SearchListProps = {
  name: string
  items: Items[]
  // eslint-disable-next-line react/require-default-props
  showTimestamp?: boolean
  osoite?: string
}

const SearchList = ({
  name, items, showTimestamp = true, osoite,
}: SearchListProps) => {
  const history = useHistory();
  const [text, setText] = useState('');
  const [lastData, setLastData] = useState([]);
  const {
    mutate, isLoading, data, status, reset,
  } = useMutation(['raporttihaku', text], mutateTapahtuma);
  const timeout = useRef();
  const [ref, {
    width, height,
  }] = useDimensions();

  const textChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    clearTimeout(timeout.current);

    if (!e.target.value) {
      reset();
      return;
    }

    (timeout as any).current = setTimeout(async () => {
      if (!osoite) return console.log('ei osoitetta');
      await mutate({ hakusana: e.target.value, osoite });
      setLastData(data?.res?.data);
    }, 250);
  };

  const itemmit = data?.res?.data && !isLoading ? data?.res?.data : items;

  return (
    <Container style={{ width }}>
      {isLoading && (
        <BorderLinearProgress style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '8px',
        }}
        />
      )}
      <InfoBar>
        <span>
          {name}
          :
        </span>
        {osoite && (
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
        )}
      </InfoBar>
      {/* <div style={{ width }}> */}
      <Scrollbars
        autoHide
        autoHideTimeout={1000}
        autoHideDuration={200}
        height="100%"
        width={width}
      >
        <Grid>
          {data && data?.res?.data?.length === 0 && (
            <GridItem style={{ justifyContent: 'center', cursor: 'default' }}>
              <Text style={{ marginTop: 0 }}>Mitään ei löytynyt</Text>
            </GridItem>
          )}
          {itemmit.map((item: any) => (
            <GridItem
              ref={ref}
              onClick={() => {
                history.push(`/${name}/${item.id}`);
              }}
              key={item.id}
            >
              <Text>{item.name}</Text>
              <ItemGrid>
                <span>
                  ID:
                  {' '}
                  {item.id}
                </span>
                {showTimestamp && (
                  <span style={{ marginLeft: 'auto' }}>
                    {formatDistance(
                      new Date(),
                      new Date(item.timestamp),
                      { locale: fi },
                    )}
                    {' '}
                    sitten
                  </span>
                )}
              </ItemGrid>
            </GridItem>
          ))}
        </Grid>

      </Scrollbars>
      {/* </div> */}
    </Container>
  );
};

export default SearchList;
