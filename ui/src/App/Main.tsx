import React, { useState } from 'react';
import {
  Box, Button, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, Paper,
} from '@mui/material';
import styled from '@emotion/styled';
import { Route, Switch, useHistory } from 'react-router-dom';
import Etusivu from './pages/etusivu';
import Tapahtumat from './pages/tapahtumat';

const Nappi = styled.button`
  color: turquoise;
`;

const CustomGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 10fr;
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
`;

const pages = ['Etusivu', 'Tapahtumat', 'Profiilit', 'Raportit', 'Todisteet'];

const Main = () => {
  const history = useHistory();
  const [page, setPage] = useState('Etusivu');

  function changePage(sivu: string) {
    setPage(sivu);
    history.push(`/${sivu}`);
  }

  return (
    <div>
      <CustomGrid>
        <Sidebar>
          <SidebarGrid>
            {pages.map((sivu) => (
              <SidebarItem active={page === sivu} key={sivu} onClick={() => changePage(sivu)}>{sivu}</SidebarItem>
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
            <Route path="/tapahtumat/:id">
              <Tapahtumat />
            </Route>
            <Route path="/tapahtumat">
              <Tapahtumat />
            </Route>
            <Route path="/dashboard">
              <h1>moro</h1>
            </Route>
          </Switch>
        </PageContents>

        {/* {page === 'Etusivu' && ( */}
        {/*  <Etusivu /> */}
        {/* )} */}

        {/* {page === 'Tapahtumat' && ( */}
        {/*  <Tapahtumat /> */}
        {/* )} */}
        {/* <h1>terve moi</h1> */}
      </CustomGrid>
    </div>
  );
};

export default Main;
