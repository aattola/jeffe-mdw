import React, { useState } from 'react';
import './App.css';

import { Slide } from '@mui/material';
import { useNuiEvent } from './hooks/useNuiEvent';
import { useExitListener } from './hooks/useExitListener';
import { debugData } from './utils/debugData';
import Main from './App/Main';

// This will set the NUI to visible if we are
// developing in browser
debugData([
  {
    action: 'setVisible',
    data: true,
  },
]);

const MyComponent = React.forwardRef((props, ref) => (
  // @ts-ignore
  <div ref={ref} {...props}>
    <Main />
  </div>
));

function App() {
  const [isOpen, setOpen] = useState(false);

  useNuiEvent('setVisible', (data: boolean) => {
    setOpen(data);
  });

  useNuiEvent('refresh', () => {
    window.location.reload();
  });
  useExitListener(setOpen);

  // if (!isOpen) return <div />;

  return (
    <div className="App" style={{ overflow: 'hidden' }}>
      <Slide timeout={100} direction="up" in={isOpen}>
        <MyComponent />
      </Slide>
    </div>
  );
}

export default App;
