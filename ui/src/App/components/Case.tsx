import React, { useState } from 'react';
import styled from '@emotion/styled';
import {
  Chip, Input, InputAdornment, LinearProgress, linearProgressClasses, TextField,
} from '@mui/material';
import { useHistory } from 'react-router-dom';
import Add from '@mui/icons-material/Add';
import Create from '@mui/icons-material/Create';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import Save from '@mui/icons-material/Save';
import { useMutation, useQueryClient } from 'react-query';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { ICase } from '../pages/raportit';
import { fetchNui } from '../../utils/fetchNui';
import TagDialog from './TagDialog';

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
  gap: 10px;
  flex-wrap: wrap;
`;

const TextContainer = styled.div`
  background: #2a3c52;
  padding: 10px;
`;

export const BorderLinearProgress = styled(LinearProgress)(({ theme }: any) => ({
  height: 10,
  borderRadius: 3,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}));

type CaseProps = {
  name: string
  caseData: ICase
  loading: boolean
  isCreate: boolean
}

async function mutateTapahtuma(data: ICase) {
  return fetchNui('tallennaTapahtuma', data);
}

async function deleteCase(id: number) {
  return fetchNui('poistaTapahtuma', { id });
}

const Case = ({
  caseData, loading: lataa, isCreate,
}: CaseProps) => {
  const history = useHistory();
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation(['case', caseData.id], mutateTapahtuma);
  const { mutateAsync: deleteAsync } = useMutation(['deleteCase', Date.now()], deleteCase);
  const { tags, police } = JSON.parse(caseData.data);
  const [name, setName] = useState(caseData.name);
  const [desc, setDesc] = useState(caseData.description);
  const [open, setOpen] = useState(false);
  const [tagit, setTags] = useState(tags ?? []);

  async function handleDeleteTapahtuma() {
    await deleteAsync(caseData.id);
    await queryClient.invalidateQueries('tapahtumat');
    history.push('/raportit');
  }

  function handleCreateNew() {
    history.push('/raportit');
  }

  async function handleSave() {
    const saveData = {
      ...caseData,
      name,
      description: desc,
      data: JSON.stringify({ tags: tagit }),
    };

    if (caseData.id === 123456789078923897) {
      // @ts-ignore
      saveData.id = undefined;
    }

    const data = await mutateAsync(saveData);
    if (data?.res?.data[0]?.id) {
      history.push(`/raportit/${data.res.data[0].id}`);
    }
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

  return (
    <Container>
      {lataa && (
        <BorderLinearProgress style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '8px',
        }}
        />
      )}
      {isLoading && (
        <BorderLinearProgress style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '8px',
        }}
        />
      )}
      <TextContainer style={{
        flex: 1, display: 'grid', gridTemplateRows: 'auto auto 1fr', gridGap: 2,
      }}
      >
        <InfoBar>

          {caseData.id !== 123456789078923897 ? (
            <>
              Raportti #
              {' '}
              {lataa ? '' : caseData.id}
            </>
          ) : (
            <span>Luo uusi raportti</span>
          )}

          <div style={{ marginLeft: 'auto' }}>
            {!isCreate && (
              <>
                <DeleteOutline onClick={handleDeleteTapahtuma} style={{ cursor: 'pointer' }} />
                <Add onClick={handleCreateNew} style={{ cursor: 'pointer' }} />
              </>
            )}
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
            value={(name ?? undefined)}
            onChange={(e) => setName(e.target.value)}
          />
        </InfoBar>

        <Scrollbars
          autoHide
          autoHideTimeout={1000}
          autoHideDuration={200}
          height="100%"
        >
          <Input
            placeholder="Selityksiä"
            multiline
            value={(desc ?? undefined)}
            minRows={25}
            disableUnderline
            onChange={(e) => setDesc(e.target.value)}
            sx={{
              backgroundColor: '#212e3e',
              flex: 1,
              width: '100%',
              textarea: {
                padding: '5px 10px',
              },
            }}
          />
        </Scrollbars>
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
