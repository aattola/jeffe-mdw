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

const CustomContainer = styled.div`
  height: 100vh;
`;

const CustomGrid = styled.div`
  display: grid;
  grid-template-rows: 125px 1fr;
  grid-template-columns: 1fr 10fr;
  height: 100%;
`;

const Header = styled.div`
  grid-column: 1 / 3;
  background: #2a3c52;
  border-image-slice: 1;
  border-image-source: linear-gradient(to left, #743ad5, #d53a9d);
  border-bottom: 2px solid #42a5f5;
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

const pages = ['Etusivu', 'Raportit', 'Profiilit', 'Poliisit', 'Rikosnimikkeet'];

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
  const [page, setPage] = useState('Etusivu');

  function changePage(sivu: string) {
    setPage(sivu);
    history.push(`/${sivu}`);
  }

  return (
    <CustomContainer>
      <div style={{ padding: '40px', height: 'calc(100vh - 80px)' }}>
        <CustomGrid>
          <Header>
            <h1 style={{ marginLeft: 20 }}>
              Logo täs
              <br />
              {' '}
              vissii
            </h1>
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
