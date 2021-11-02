import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Chip, TextField } from '@mui/material';
import { useState } from 'react';

type TagDialogProps = {
  open: boolean
  tagit: any[]
  // eslint-disable-next-line no-unused-vars
  setOpen: (open: boolean) => void
  // eslint-disable-next-line no-unused-vars
  setTagit: (newState: any) => void
}

export default function TagDialog({
  open, setOpen, tagit, setTagit,
}: TagDialogProps) {
  const [text, setText] = useState('');

  const handleClose = () => {
    setOpen(false);
  };

  const handleAdd = () => {
    setTagit((tags: any[]) => [
      ...tags,
      { label: text, id: Date.now() },
    ]);
    setText('');
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="tag-dialog"
        aria-describedby="tag-dialog"
      >
        <DialogTitle id="tag-dialog">
          Lisää tagit
        </DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <TextField value={text} onChange={(e) => setText(e.target.value)} placeholder="Tagin nimi" />
              <Button onClick={handleAdd}>Lisää</Button>
            </div>
            <div>
              {tagit?.map((tag: {label: string, id: number}) => (
                <Chip key={tag.id} label={tag.label} />
              ))}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Tallenna
          </Button>

        </DialogActions>
      </Dialog>
    </div>
  );
}
