import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import {
  Divider, Input, InputAdornment, TextField,
} from '@mui/material';
import { useHistory } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import ImageIcon from '@mui/icons-material/Image';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import { Scrollbars } from 'react-custom-scrollbars-2';
import Add from '@mui/icons-material/Add';
import Save from '@mui/icons-material/Save';
import { useMutation, useQueryClient } from 'react-query';
import { fetchNui } from '../../utils/fetchNui';

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
  flex-wrap: wrap;
  justify-content: center;
`;

const TextFieldGrid = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: column;
  
  padding: 5px 10px;
`;

const TextContainer = styled.div`
  background: #2a3c52;
  padding: 10px;
  flex: 1;
  
  display: flex;
  flex-direction: column;
`;

async function mutateTapahtuma(data: any) {
  return fetchNui('tallennaProfiili', data);
}

type ProfileProps = {
  profileData: any
  isCreate?: boolean
}

const Profile = ({ profileData, isCreate = false }: ProfileProps) => {
  const queryClient = useQueryClient();
  const history = useHistory();
  const { mutateAsync } = useMutation(['profiili', profileData.id], mutateTapahtuma);
  const [name, setName] = useState(profileData.name);
  const [cid, setCid] = useState(profileData.cid);
  const [image, setImage] = useState(profileData.image ?? 'https://images.theconversation.com/files/229852/original/file-20180730-106514-1tfe2rs.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=926&fit=clip');
  const [desc, setDesc] = useState(profileData.description);
  const [inputError, setError] = useState(false);

  useEffect(() => {
    setName(profileData.name);
    setCid(profileData.cid);
    setImage(profileData.image ?? 'https://images.theconversation.com/files/229852/original/file-20180730-106514-1tfe2rs.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=926&fit=clip');
    setDesc(profileData.description);
  }, [profileData]);

  const handleSave = async () => {
    const saveData = {
      ...profileData,
      name,
      cid,
      image,
      description: desc,
    };

    if (!name && !cid) {
      setTimeout(() => {
        setError(false);
      }, 2000);
      return setError(true);
    }

    const data = await mutateAsync(saveData);
    if (data?.res?.data[0]?.id) {
      history.push(`/profiilit/${data.res.data[0].id}`);
    }
    await queryClient.invalidateQueries('profiilit');
    await queryClient.invalidateQueries(['profiili', profileData.id]);
  };

  return (
    <Container>
      <TextContainer>
        <InfoBar>
          {isCreate ? (
            <span>Luo uusi profiili</span>
          ) : (
            <span>
              Profiili #
              {profileData.id}
            </span>
          )}
          <div style={{ marginLeft: 'auto' }}>
            {!isCreate && (
              <Add onClick={() => history.push('/profiilit')} style={{ cursor: 'pointer' }} />
            )}
            <Save onClick={handleSave} style={{ cursor: 'pointer' }} />
          </div>
        </InfoBar>
        <InfoBar style={{ alignItems: 'center' }}>
          <img style={{ maxWidth: '200px', marginRight: 20 }} src={image} alt={profileData.name} />
          <TextFieldGrid style={{ marginTop: 10 }}>
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
              id="search"
              label="Nimi"
              variant="standard"
              error={inputError}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountBoxOutlinedIcon />
                  </InputAdornment>
                ),
              }}
              variant="standard"
              label="Id"
              type="number"
              error={inputError}
              value={cid}
              onChange={(e) => setCid(e.target.value)}
            />
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ImageIcon />
                  </InputAdornment>
                ),
              }}
              variant="standard"
              label="Kuva"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </TextFieldGrid>
        </InfoBar>

        <Divider sx={{ marginY: 2 }} />

        <Scrollbars
          autoHide
          autoHideTimeout={1000}
          autoHideDuration={200}
        >
          <Input
            placeholder="Lisätietoja"
            multiline
            value={(desc ?? undefined)}
            minRows={20}
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
    </Container>
  );
};

export default Profile;
