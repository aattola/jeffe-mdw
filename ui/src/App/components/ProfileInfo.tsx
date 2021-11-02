import React from 'react';
import styled from '@emotion/styled';
import { Chip } from '@mui/material';

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

const ChipGrid = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const TextContainer = styled.div`
  background: #2a3c52;
  padding: 10px;
`;

type ProfileInfoProps = {
  profileData: any
  id: number
}

const ProfileInfo = ({ profileData, id }: ProfileInfoProps) => {
  const rikoksetVammanen: any[] = profileData.res.rikokset.map((raportti: {id: number, rikolliset: any}) => {
    const rikoksetTuosta = raportti.rikolliset.charges.map((rikollinen: any) => {
      if (rikollinen.rikollinen === id) return rikollinen;
      return null;
    });

    return rikoksetTuosta.map((a: any) => {
      if (a) {
        return {
          raporttiId: raportti.id,
          ...a,
        };
      }

      return null;
    });
  });

  const rikokset = rikoksetVammanen.reduce((previousValue, currentValue) => {
    const value = [...previousValue];
    currentValue.forEach((a: any) => value.push(a));
    return value;
  }, []).filter((a: any) => a !== null);

  const rikosKeissi: any = {};

  rikokset.forEach((r: any) => {
    const k = rikosKeissi[r.id];
    if (k) {
      rikosKeissi[r.id] = [...k, r];
    } else {
      rikosKeissi[r.id] = [r];
    }
  });

  return (
    <Container>
      <TextContainer>
        <InfoBar style={{ marginBottom: 0 }}>
          Rikokset

          {/* <div style={{ marginLeft: 'auto' }}> */}
          {/*  <Add style={{ cursor: 'pointer' }} /> */}
          {/*  <Save style={{ marginLeft: 'auto', cursor: 'pointer' }} /> */}
          {/* </div> */}
        </InfoBar>

        <ChipGrid style={{ marginTop: 5 }}>
          {Object.keys(rikosKeissi).map((index) => (
            <Chip style={{ background: 'black' }} key={index} variant="filled" label={`${rikosKeissi[index].length} ${rikosKeissi[index][0].label}`} />
          ))}
          {/* {rikokset.map((rikos: any) => ( */}
          {/*  <Chip style={{ background: 'black' }} variant="filled" label={rikos.label} /> */}
          {/* ))} */}
        </ChipGrid>
      </TextContainer>

      <TextContainer>
        <InfoBar style={{ marginBottom: 0 }}>
          Asunnot
        </InfoBar>

        <ChipGrid style={{ marginTop: 5 }}>
          <Chip style={{ background: 'white', color: 'black' }} label="Talo 3532 (DEMO)" />
        </ChipGrid>
      </TextContainer>

      <TextContainer>
        <InfoBar style={{ marginBottom: 0 }}>
          Autot
        </InfoBar>

        <ChipGrid style={{ marginTop: 5 }}>
          <Chip style={{ background: 'white', color: 'black' }} label="Ford Fiesta 1992" />
        </ChipGrid>
      </TextContainer>

    </Container>
  );
};

export default ProfileInfo;
