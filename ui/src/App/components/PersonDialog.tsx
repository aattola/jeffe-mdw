import * as React from 'react';
import { ChangeEvent, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {
  Card, CardContent, List, TextField,
} from '@mui/material';
import { useMutation } from 'react-query';
import { fetchNui } from '../../utils/fetchNui';

type PersonDialogProps = {
  open: boolean
  personnel: any[]
  // eslint-disable-next-line no-unused-vars
  setOpen: (open: boolean) => void
  // eslint-disable-next-line no-unused-vars
  setPersonnel: (newState: any) => void
}

async function mutateTapahtuma(data: {hakusana: string}) {
  return fetchNui('haerikollisia', data);
}

interface Person {
  name: string
  id: number
  cid: number
  image: string
  description: string
}

export default function PersonDialog({
  open, setOpen, setPersonnel, personnel,
}: PersonDialogProps) {
  const [text, setText] = useState('');
  const {
    mutate, data, reset,
  } = useMutation(['profiilihaku', text], mutateTapahtuma);
  const timeout = useRef();

  const textChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    clearTimeout(timeout.current);

    if (!e.target.value) {
      return;
    }

    (timeout as any).current = setTimeout(() => {
      mutate({ hakusana: e.target.value });
    }, 250);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAdd = (person: Person) => {
    const list = personnel.filter((p: any) => p.id === person.id);
    if (list[0]) return;
    setPersonnel((persons: any[]) => [
      ...persons,
      { label: person.name, id: person.id },
    ]);
    setOpen(false);
    setText('');
    reset();
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle id="tag-dialog">
          Lisää rikollisia
        </DialogTitle>
        <DialogContent style={{ minWidth: 450 }}>
          <TextField
            fullWidth
            label="Hae rikollisia"
            variant="filled"
            value={text}
            onChange={textChange}
          />

          <List>
            {data && data?.res?.data?.length === 0 && (
              <p>
                Mitään ei löytynyt hakusanalla
              </p>
            )}
            {data && data?.res?.data?.map((profiili: any) => (
              <Card style={{ marginTop: 10 }} key={profiili.id}>
                <CardContent>
                  <div style={{ display: 'flex', gap: 15 }}>
                    <img style={{ maxWidth: 125 }} alt="kuva" src={profiili.image ?? 'https://images.theconversation.com/files/229852/original/file-20180730-106514-1tfe2rs.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=926&fit=clip'} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <h1 style={{ margin: 0, fontSize: 20 }}>{profiili.name}</h1>
                      <p style={{ margin: 0, marginTop: 2 }}>
                        ID:
                        {' '}
                        {profiili.id}
                      </p>
                      <Button
                        style={{ marginTop: 'auto' }}
                        variant="outlined"
                        onClick={() => handleAdd(profiili)}
                      >
                        Lisää
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </List>

        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClose} autoFocus> */}
          {/*  Tallenna */}
          {/* </Button> */}

        </DialogActions>
      </Dialog>
    </div>
  );
}
