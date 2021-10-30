import React, { useState } from 'react';
import styled from '@emotion/styled';
import {
  Checkbox,
  Chip, Divider, FormControlLabel, FormGroup, InputAdornment, TextField,
} from '@mui/material';
import { useHistory } from 'react-router-dom';
import Add from '@mui/icons-material/Add';
import Save from '@mui/icons-material/Save';
import DeleteOutline from '@mui/icons-material/Remove';
import { ICase } from '../pages/raportit';
import PersonDialog from './PersonDialog';

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
  const [open, setOpen] = useState(false);
  const [criminals, setCriminals] = useState([]);

  const handleRemove = (crimId: number) => {
    const newCriminals = criminals.filter((c: any) => c.id !== crimId);
    setCriminals(newCriminals);
  };

  return (
    <Container>
      <TextContainer>
        <InfoBar style={{ marginBottom: 0 }}>
          Rikolliset

          <div style={{ marginLeft: 'auto' }}>
            <Add onClick={() => setOpen(true)} style={{ cursor: 'pointer' }} />
            <Save style={{ marginLeft: 'auto', cursor: 'pointer' }} />
          </div>
        </InfoBar>

        <PersonDialog personnel={criminals} open={open} setOpen={setOpen} setPersonnel={setCriminals} />

      </TextContainer>

      {criminals.map((criminal: {label: string, id: number}) => (
        <TextContainer key={criminal.id}>
          <InfoBar>
            <span>{criminal.label}</span>
            <div style={{ marginLeft: 'auto' }}>
              <DeleteOutline onClick={() => handleRemove(criminal.id)} style={{ marginLeft: 'auto', cursor: 'pointer' }} />
            </div>
          </InfoBar>

          <Divider sx={{ marginY: 2 }} />

          <InfoBar>
            <span>Syytteet:</span>
            <Add style={{ marginLeft: 'auto', cursor: 'pointer' }} />
          </InfoBar>
          <ChipGrid>
            {/* <Chip label="RDM" onDelete={() => null} /> */}
            {/* <Chip label="Tori kkontenttia" onDelete={() => null} /> */}
            {/* <Chip label="Rauhanrekka" onDelete={() => null} /> */}
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
      ))}
    </Container>
  );
};

export default Rikollinen;
