import React, { useState } from 'react';
import {
  Box, Button, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, Paper,
} from '@mui/material';
import styled from '@emotion/styled';
import {
  Route, Switch, useHistory, useLocation,
} from 'react-router-dom';
import Etusivu from './pages/etusivu';
import Raportit from './pages/raportit';
import Profiilit from './pages/profiilit';
import Rikosnimikkeet from './pages/rikosnimikkeet';
import useHover from './components/useHover';
import Kuva from '../images/lspd.png';

const CustomContainer = styled.div<{see: boolean}>`
  height: 100vh;
  opacity: ${(props) => (!props.see ? 1 : 0.45)};
  transition: all .1s ease;
`;

const CustomGrid = styled.div`
  display: grid;
  grid-template-rows: 150px 1fr;
  grid-template-columns: 1fr 10fr;
  height: 100%;
`;

const Header = styled.div`
  grid-column: 1 / 3;
  background: #2a3c52;
  border-bottom: 2px solid rgb(66 165 245 / 66%);
  
  //border-image-slice: 1;
  //border-image-source: linear-gradient(to left, #743ad5, #d53a9d);
`;

const Kortti = styled.div`
  display: flex;
  align-items: center;
  background: #1c1d24;
  border-radius: 9000px;
  width: max-content;
  margin: 10px;
  padding-right: 50px;
`;

const Sidebar = styled.div`
  background: #282c34;
`;

const SidebarGrid = styled.div`
  display: grid;
  grid-template-rows: repeat(5, 60px);
  min-width: 180px;
`;

const SidebarItem = styled.div<{active: boolean}>`
  display: flex;
  align-items: center;
  padding: 5px 10px;
  font-size: 1.1rem;
  
  color: white;
  cursor: pointer;
  background: ${(props) => (props.active ? '#3e495e' : '#282c34')};

  transition: all .15s ease;
  
  :hover {
    background: #373d48;
  }
  
  :active {
    background: #21252e;
  }
`;

const PageContents = styled.div`
  background: #3e495e;
  display: flex;
`;

const pages = ['Etusivu', 'Raportit', 'Profiilit', 'Rikosnimikkeet'];

const tabs = [
  {
    route: '/raportit/3',
    page: 'Raportit',
    id: 1,
  }, {
    route: '/profiilit',
    page: 'Profiilit',
    id: 2,
  }, {
    route: '/profiilit/3',
    page: 'Profiilit',
    id: 3,
  },
];

const Main = () => {
  const history = useHistory();
  const location = useLocation<string>();
  const [hoverRef, isHovered] = useHover();

  function changePage(sivu: string) {
    history.push(`/${sivu}`);
  }

  return (
    <CustomContainer see={(isHovered as any)}>
      <div style={{ padding: '40px', height: 'calc(100vh - 80px)' }}>
        <CustomGrid>
          <Header ref={(hoverRef as any)}>
            <Kortti>
              <img style={{ marginLeft: 10 }} height={115} src={Kuva} alt="ok" />
              <h1 style={{ marginLeft: 20 }}>
                Poliisi
                <br />
                {' '}
                Sheriffi
              </h1>
            </Kortti>
          </Header>

          <Sidebar>
            <SidebarGrid>
              {pages.map((sivu) => (
                <SidebarItem active={location.pathname.toLowerCase().includes(sivu.toLowerCase())} key={sivu} onClick={() => changePage(sivu)}>{sivu}</SidebarItem>
              ))}
            </SidebarGrid>
          </Sidebar>

          <PageContents>
            <Switch>
              <Route exact path="/">
                <Etusivu />
              </Route>
              <Route path="/etusivu">
                <Etusivu />
              </Route>
              <Route path="/raportit/:id">
                <Raportit />
              </Route>
              <Route path="/raportit">
                <Raportit />
              </Route>
              <Route path="/profiilit/:id">
                <Profiilit />
              </Route>
              <Route path="/profiilit">
                <Profiilit />
              </Route>
              <Route path="/poliisit">
                <h1>poliseja</h1>
              </Route>
              <Route path="/rikosnimikkeet">
                <Rikosnimikkeet addMode={false} />
              </Route>
            </Switch>
          </PageContents>
        </CustomGrid>
      </div>
    </CustomContainer>
  );
};

export default Main;
