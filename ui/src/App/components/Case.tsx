import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Chip, InputAdornment, TextField } from '@mui/material';
import { useHistory } from 'react-router-dom';
import Add from '@mui/icons-material/Add';
import Create from '@mui/icons-material/Create';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import Save from '@mui/icons-material/Save';
import { useMutation, useQueryClient } from 'react-query';
import { ICase } from '../pages/tapahtumat';
import { fetchNui } from '../../utils/fetchNui';
import TagDialog from './TagDialog';

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

async function mutateTapahtuma(data: ICase) {
  return fetchNui('tallennaTapahtuma', data);
}

async function mutateNew() {
  return fetchNui('uusiTapahtuma');
}

async function deleteCase(id: number) {
  return fetchNui('poistaTapahtuma', { id });
}

const Case = ({ id, caseData }: CaseProps) => {
  const history = useHistory();
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation(['case', caseData.id], mutateTapahtuma);
  const { mutateAsync: newAsync, isLoading: loading } = useMutation(['newCase', Date.now()], mutateNew);
  const { mutateAsync: deleteAsync } = useMutation(['deleteCase', Date.now()], deleteCase);
  const { tags, police } = JSON.parse(caseData.data);
  const [name, setName] = useState(caseData.name);
  const [desc, setDesc] = useState(caseData.description);
  const [open, setOpen] = useState(false);
  const [tagit, setTags] = useState(tags ?? []);

  async function handleDeleteTapahtuma() {
    await deleteAsync(caseData.id);
    await queryClient.invalidateQueries('tapahtumat');
    history.push('/tapahtumat');
  }

  async function handleCreateNew() {
    await newAsync();
    await queryClient.invalidateQueries('tapahtumat');
  }

  async function handleSave() {
    const saveData = {
      ...caseData,
      name,
      description: desc,
      data: JSON.stringify({ tags: tagit }),
    };

    await mutateAsync(saveData);
    await queryClient.invalidateQueries('tapahtumat');
  }

  function handleDelete(e: any) {
    const newTags = tagit.filter((tag: any) => {
      if (tag.id !== e) {
        return tag;
      }
      return null;
    });
    setTags(newTags);
  }

  function handlePoliceDelete(e: number) {
    console.log(e, 'delete eventti');
  }

  console.log('tags & police', tags, police, tagit);
  return (
    <Container>
      <TextContainer>
        <InfoBar>
          Tapahtuma #
          {caseData.id}

          <div style={{ marginLeft: 'auto' }}>
            <DeleteOutline onClick={handleDeleteTapahtuma} style={{ cursor: 'pointer' }} />
            <Add onClick={handleCreateNew} style={{ cursor: 'pointer' }} />
            <Save onClick={handleSave} style={{ cursor: 'pointer' }} />
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
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </InfoBar>
        <Grid>

          <TextField
            placeholder="Selityksiä"
            multiline
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
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
            {police?.map((tag: {label: string, id: number}) => (
              <Chip key={tag.id} label={tag.label} onDelete={() => handlePoliceDelete(tag.id)} />
            ))}
            {/* <Chip label="P. Tellervo" variant="outlined" onDelete={handleDelete} /> */}
            {/* <Chip label="L. Aapinen" variant="outlined" onDelete={handleDelete} /> */}
          </ChipGrid>
        </Grid>
      </TextContainer>

      <TextContainer>
        <InfoBar>
          <span>Tagit:</span>
          <Add onClick={() => setOpen(true)} style={{ marginLeft: 'auto', cursor: 'pointer' }} />
        </InfoBar>
        <Grid>
          <TagDialog open={open} setOpen={setOpen} tagit={tagit} setTagit={setTags} />
          <ChipGrid>
            {tagit?.map((tag: {label: string, id: number}) => (
              <Chip key={tag.id} label={tag.label} onDelete={() => handleDelete(tag.id)} />
            ))}
          </ChipGrid>
        </Grid>
      </TextContainer>
    </Container>
  );
};

export default Case;
