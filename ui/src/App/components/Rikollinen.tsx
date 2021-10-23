import React from 'react';
import styled from '@emotion/styled';
import {
  Checkbox,
  Chip, Divider, FormControlLabel, FormGroup, InputAdornment, TextField,
} from '@mui/material';
import { useHistory } from 'react-router-dom';
import {
  Add, Create, DeleteOutline, Save, Search,
} from '@mui/icons-material';
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

type RikollinenProps = {
  id: string
  caseData: ICase
}

const Rikollinen = ({ id, caseData }: RikollinenProps) => {
  const history = useHistory();

  return (
    <Container>
      <TextContainer>
        <InfoBar style={{ marginBottom: 0 }}>
          Lisää rikollinen

          <div style={{ marginLeft: 'auto' }}>
            <Add style={{ cursor: 'pointer' }} />
          </div>
        </InfoBar>

      </TextContainer>

      <TextContainer>
        <InfoBar>
          <span>Pena Tellervo</span>
          <div style={{ marginLeft: 'auto' }}>
            <DeleteOutline style={{ marginLeft: 'auto', cursor: 'pointer' }} />
            <Save style={{ marginLeft: 'auto', cursor: 'pointer' }} />
          </div>
        </InfoBar>

        <Divider sx={{ marginY: 2 }} />

        <InfoBar>
          <span>Syytteet:</span>
          <Add style={{ marginLeft: 'auto', cursor: 'pointer' }} />
        </InfoBar>
        <ChipGrid>
          <Chip label="RDM" onDelete={() => null} />
          <Chip label="Tori kkontenttia" onDelete={() => null} />
          <Chip label="Rauhanrekka" onDelete={() => null} />
        </ChipGrid>

        <Divider sx={{ marginY: 2 }} />

        <FormGroup>
          <FormControlLabel control={<Checkbox />} label="Etsintäkuuluta" />
        </FormGroup>

        <Divider sx={{ marginY: 2 }} />

        <FormGroup sx={{ flexDirection: 'row', gap: 5 }}>
          <FormControlLabel control={<Checkbox disabled />} label="Syyllinen" />
          <FormControlLabel control={<Checkbox />} label="Prosessoitu" />
        </FormGroup>

      </TextContainer>
    </Container>
  );
};

export default Rikollinen;
