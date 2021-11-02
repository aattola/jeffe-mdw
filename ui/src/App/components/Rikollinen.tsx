import React, { useState } from 'react';
import styled from '@emotion/styled';
import {
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  InputLabel,
  MenuItem, Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { useHistory } from 'react-router-dom';
import Add from '@mui/icons-material/Add';
import Save from '@mui/icons-material/Save';
import DeleteOutline from '@mui/icons-material/Remove';
import ReplayIcon from '@mui/icons-material/Replay';
import { useMutation, useQueryClient } from 'react-query';
import { ICase } from '../pages/raportit';
import PersonDialog from './PersonDialog';
import SyyteDialog from './SyyteDialog';
import { fetchNui } from '../../utils/fetchNui';
import { BorderLinearProgress } from './Case';

const Container = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  position: relative;
  
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
  gap: 6px;
  flex-wrap: wrap;
`;

const TextContainer = styled.div`
  background: #2a3c52;
  padding: 10px;
`;

async function mutateTapahtuma(data: {id: number, rikolliset: string}) {
  return fetchNui('tallennaTapahtuma', data);
}

interface Items {
  name: string
  id: number
  timestamp: number
}

type RikollinenProps = {
  id: string
  caseData: ICase
  mutate?: (options: any) => any
}

interface Syyte {
  id: number
  key: number
  label: string
  rikollinen: number
  sakko: number
}

const Rikollinen = ({ id, caseData, mutate: mutaa }: RikollinenProps) => {
  const history = useHistory();
  const rikolliset = JSON.parse(caseData.rikolliset);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [chargesOpen, setChargesOpen] = useState(false);
  const [kriminaali, setKriminaali] = useState({ label: 'ei', id: 0 });
  const [criminals, setCriminals] = useState(rikolliset.criminals ?? []);
  const [charges, setCharges] = useState(rikolliset.charges ?? []);
  const [vahennykset, setVahennykset] = React.useState(rikolliset.vahennykset ?? 1);
  const { mutate, isLoading } = useMutation(['case', caseData.id], mutateTapahtuma);

  const handleChange = (event: SelectChangeEvent) => {
    setVahennykset(Number(event.target.value));
  };

  const handleRemove = (crimId: number) => {
    const newCriminals = criminals.filter((c: any) => c.id !== crimId);
    setCriminals(newCriminals);
  };

  const openMenu = (crimmi: any) => {
    setKriminaali(crimmi);
    setChargesOpen(true);
  };

  const handleRefetch = async () => {
    if (mutaa) {
      await mutaa({ id: caseData.id, refresh: true });
      const saveRikolliset = {
        criminals,
        charges,
        vahennykset,
      };

      const saveData = {
        ...caseData,
        id: caseData.id,
        rikolliset: JSON.stringify(saveRikolliset),
      };

      await mutate(saveData);
      await queryClient.invalidateQueries('tapahtumat');
    }
  };

  const handleSave = async () => {
    const saveRikolliset = {
      criminals,
      charges,
      vahennykset,
    };

    const saveData = {
      id: caseData.id,
      rikolliset: JSON.stringify(saveRikolliset),
    };

    await mutate(saveData);
    await queryClient.invalidateQueries('tapahtumat');
  };

  return (
    <Container>
      {isLoading && (
        <BorderLinearProgress style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '8px',
        }}
        />
      )}
      <TextContainer>
        <InfoBar style={{ marginBottom: 0 }}>
          Rikolliset

          <div style={{ marginLeft: 'auto' }}>
            <ReplayIcon style={{ cursor: 'pointer' }} onClick={handleRefetch} />
            <Add onClick={() => setOpen(true)} style={{ cursor: 'pointer' }} />
            <Save onClick={handleSave} style={{ marginLeft: 'auto', cursor: 'pointer' }} />
          </div>
          <SyyteDialog rikollinen={kriminaali} open={chargesOpen} setOpen={setChargesOpen} charges={charges} setCharges={setCharges} />

        </InfoBar>

        <PersonDialog personnel={criminals} open={open} setOpen={setOpen} setPersonnel={setCriminals} />

      </TextContainer>

      {criminals.map((criminal: {label: string, id: number}) => {
        const currCharges: Syyte[] = charges.filter((a: any) => a.rikollinen === criminal.id);
        const total = currCharges[0] ? currCharges.reduce((acc, currentValue) => acc + currentValue.sakko, 0) : 0;

        const currCharget: any = {};

        currCharges.forEach((r: any) => {
          const k = currCharget[r.id];
          if (k) {
            currCharget[r.id] = [...k, r];
          } else {
            currCharget[r.id] = [r];
          }
        });

        return (
          <TextContainer key={criminal.id} style={{ padding: '15px 15px' }}>
            <InfoBar>
              <span role="none" style={{ cursor: 'pointer' }} onClick={() => history.push(`/profiilit/${criminal.id}`)}>{criminal.label}</span>
              <div style={{ marginLeft: 'auto' }}>
                <DeleteOutline onClick={() => handleRemove(criminal.id)} style={{ marginLeft: 'auto', cursor: 'pointer' }} />
              </div>
            </InfoBar>

            <Divider sx={{ marginY: 2 }} />

            <InfoBar>
              <span>Syytteet:</span>
              {/* <Add onClick={() => openMenu(criminal)} style={{ marginLeft: 'auto', cursor: 'pointer' }} /> */}
            </InfoBar>

            <ChipGrid>
              <Chip style={{ background: 'white', color: 'black' }} label="Muokkaa" variant="outlined" onClick={() => openMenu(criminal)} />
              {Object.keys(currCharget).map((index) => (
                <Chip style={{ background: 'black' }} key={index} variant="filled" label={`${currCharget[index].length} ${currCharget[index][0].label}`} />
              ))}
            </ChipGrid>

            <Divider sx={{ marginY: 2 }} />

            <FormGroup>
              <FormControlLabel control={<Checkbox disabled />} label="Etsintäkuuluta" />
            </FormGroup>

            <Divider sx={{ marginY: 2 }} />

            <InfoBar style={{ margin: '10px 0px' }}>
              <FormControl
                variant="standard"
                sx={{
                  minWidth: 120, width: '100%',
                }}
              >
                <InputLabel id="vahennykset">Vähennykset</InputLabel>
                <Select
                  fullWidth
                  labelId="vahennykset"
                  value={(vahennykset as any)}
                  onChange={handleChange}
                  label="Vahennykset"
                >
                  <MenuItem value={1}>
                    0% /
                    {' '}
                    {total}
                    €
                  </MenuItem>
                  <MenuItem value={0.90}>
                    10% /
                    {' '}
                    {total * 0.90}
                    €
                  </MenuItem>
                  <MenuItem value={0.75}>
                    25% /
                    {' '}
                    {total * 0.75}
                    €
                  </MenuItem>
                  <MenuItem value={0.50}>
                    50% /
                    {' '}
                    {total * 0.50}
                    €
                  </MenuItem>
                  <MenuItem value={0.25}>
                    75% /
                    {' '}
                    {total * 0.25}
                    €
                  </MenuItem>
                </Select>
              </FormControl>
            </InfoBar>

            <InfoBar>
              <span>
                Yhteensä:
                {' '}
                {total * vahennykset}
                €
              </span>

            </InfoBar>

            <FormGroup sx={{ flexDirection: 'row', gap: 5 }}>
              <FormControlLabel control={<Checkbox disabled />} label="Syyllinen" />
              <FormControlLabel control={<Checkbox disabled />} label="Prosessoitu" />
            </FormGroup>
          </TextContainer>
        );
      })}
    </Container>
  );
};

export default Rikollinen;
