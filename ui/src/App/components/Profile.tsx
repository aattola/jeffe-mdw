import React from 'react';
import styled from '@emotion/styled';
import {
  Checkbox,
  Chip, Divider, FormControlLabel, FormGroup, InputAdornment, TextField,
} from '@mui/material';
import { useHistory } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import ImageIcon from '@mui/icons-material/Image';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';

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
  flex-wrap: wrap;
  justify-content: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-rows: repeat(auto-fill, 1fr);
  grid-gap: 20px;
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
`;

interface Items {
  name: string
  id: number
  timestamp: number
}

type ProfileProps = {
  id: string
  profileData: any
}

const Profile = ({ profileData, id }: ProfileProps) => {
  const history = useHistory();
  console.log(profileData);
  return (
    <Container>
      <TextContainer>
        <InfoBar>
          {profileData.image && (
            <img style={{ maxWidth: '200px', marginRight: 20 }} src={profileData.image} alt={profileData.name} />
          )}
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
              value={profileData.name}
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
              value={profileData.cid}
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
              value={profileData.image}
            />
          </TextFieldGrid>
        </InfoBar>

        <Divider sx={{ marginY: 2 }} />

        <TextField
          placeholder="Selityksiä"
          multiline
          value={profileData.description}
          minRows={8}
          fullWidth
        />
      </TextContainer>
    </Container>
  );
};

export default Profile;
