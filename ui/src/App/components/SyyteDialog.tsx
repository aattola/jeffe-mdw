import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import styled from '@emotion/styled';
import { List, ListItem } from '@mui/material';
import { Scrollbars } from 'react-custom-scrollbars-2';
import Rikosnimikkeet from '../pages/rikosnimikkeet';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 250px auto;
  height: 100%;
`;

const ChargeGrid = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
  height: 100%;
`;

type SyyteDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  charges: any[]
  setCharges: (newState: any) => void
  rikollinen: { id: number, label: string }
}

export default function SyyteDialog({
  open, setOpen, charges: allCharges, setCharges, rikollinen,
}: SyyteDialogProps) {
  const charges = allCharges.filter((a) => a.rikollinen === rikollinen.id);

  const handleClose = () => {
    setOpen(false);
  };

  const addNimike = (nimike: {id: number, nimike: string, kuvaus: string, sakko: number, kategoria: number}) => {
    setCharges((curr: any[]) => [
      ...curr,
      {
        label: nimike.nimike, key: Date.now(), id: nimike.id, sakko: nimike.sakko, rikollinen: rikollinen.id,
      },
    ]);
  };

  const removeCharge = (id: number) => {
    const newCharges = charges.filter((c) => c.key !== id);
    setCharges(newCharges);
  };

  const total = charges[0] ? charges.reduce((acc, currentValue) => acc + currentValue.sakko, 0) : 0;

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        style={{ padding: 60 }}
      >
        <DialogTitle style={{ background: '#272e3c' }}>
          Lisää rikkeitä rikolliselle
          {' '}
          {rikollinen.label}
        </DialogTitle>
        <DialogContent style={{ background: '#272e3c' }}>
          <Grid>
            <ChargeGrid>
              <Scrollbars
                autoHide
              >
                <List style={{ paddingRight: 5, paddingTop: 25 }}>
                  <h3>Rikosnimikkeet:</h3>
                  {charges.map((charge: any) => (
                    <ListItem onClick={() => removeCharge(charge.key)} button key={charge.key}>
                      {charge.label}
                    </ListItem>
                  ))}

                </List>
              </Scrollbars>

              <div style={{ marginTop: 10 }}>
                <h3>
                  Yhteensä:
                  {' '}
                  {total}
                  €
                </h3>
              </div>
            </ChargeGrid>
            <Rikosnimikkeet addMode addNimike={addNimike} />
          </Grid>
        </DialogContent>
        <DialogActions style={{ background: '#272e3c' }}>
          <Button onClick={handleClose} autoFocus>
            Tallenna
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
