import React from 'react';
import styled from '@emotion/styled';
import { Chip, InputAdornment, TextField } from '@mui/material';
import { useHistory } from 'react-router-dom';
import Add from '@mui/icons-material/Add';
import Create from '@mui/icons-material/Create';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import Search from '@mui/icons-material/Search';
import { ICase } from '../pages/tapahtumat';

const Container = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  
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

const Grid = styled.div`
  display: grid;
  grid-template-rows: repeat(auto-fill, 1fr);
  grid-gap: 20px;
`;

const ChipGrid = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const TextContainer = styled.div`
  background: #2a3c52;
  padding: 10px;
`;

interface Items {
  name: string
  id: number
  timestamp: number
}

type CaseProps = {
  name: string
  id: string
  caseData: ICase
}

const Case = ({ name, id, caseData }: CaseProps) => {
  const history = useHistory();

  function handleDelete(e: any) {
    console.log(e, 'delete eventti');
  }

  const { tags } = JSON.parse(caseData.data);
  console.log('tags', tags);
  return (
    <Container>
      <TextContainer>
        <InfoBar>
          Tapahtuma #
          {caseData.id}

          <div style={{ marginLeft: 'auto' }}>
            <DeleteOutline style={{ cursor: 'pointer' }} />
            <Add style={{ cursor: 'pointer' }} />
          </div>
        </InfoBar>
        <InfoBar style={{ marginTop: 5 }}>
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Create />
                </InputAdornment>
              ),
            }}
            fullWidth
            id="search"
            label="Nimi"
            variant="standard"
            value={caseData.name}
          />
        </InfoBar>
        <Grid>

          <TextField
            placeholder="Selityksiä"
            multiline
            value={caseData.description}
            minRows={8}
          />
        </Grid>
      </TextContainer>

      <TextContainer>
        <InfoBar>
          <span>Poliisit:</span>
          <Add style={{ marginLeft: 'auto', cursor: 'pointer' }} />
        </InfoBar>
        <Grid>
          <ChipGrid>
            <Chip label="P. Tellervo" variant="outlined" onDelete={handleDelete} />
            <Chip label="L. Aapinen" variant="outlined" onDelete={handleDelete} />
          </ChipGrid>
        </Grid>
      </TextContainer>

      <TextContainer>
        <InfoBar>
          <span>Tagit:</span>
          <Add style={{ marginLeft: 'auto', cursor: 'pointer' }} />
        </InfoBar>
        <Grid>
          <ChipGrid>
            {tags?.map((tag: {label: string, id: number}) => (
              <Chip label={tag.label} onDelete={() => handleDelete(tag.id)} />
            ))}
          </ChipGrid>
        </Grid>
      </TextContainer>
    </Container>
  );
};

export default Case;
