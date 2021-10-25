/* eslint-disable import/no-duplicates */
import React from 'react';
import styled from '@emotion/styled';
import { InputAdornment, TextField } from '@mui/material';
import { useHistory } from 'react-router-dom';
import Search from '@mui/icons-material/Search';
import fi from 'date-fns/locale/fi';
import { formatDistance } from 'date-fns';

const Container = styled.div`
  background: #2a3c52;
  padding: 10px;
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
}

const SearchList = ({ name, items, showTimestamp = true }: SearchListProps) => {
  const history = useHistory();

  return (
    <Container>
      <InfoBar>
        <span>
          {name}
          :
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
        />
      </InfoBar>
      <Grid>
        {items.map((item) => (
          <GridItem
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
    </Container>
  );
};

export default SearchList;
