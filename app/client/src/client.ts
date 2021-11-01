// import * as Cfx from 'fivem-js';

import { Delay } from '@app/shared/functions';
import TapahtumatManager from './managers/Tapahtumat';

TapahtumatManager.getInstance();

console.log('Ladattu');

RegisterNuiCallbackType('ip');
on('__cfx_nui:ip', (data: any, cb: (responseData: any) => void) => {
  cb({ ok: true, ip: GetCurrentServerEndpoint().split(':')[0] });
});

let nuiOpen = false;
let tablet: number = null;
const animDict = 'amb@world_human_seat_wall_tablet@female@base';

async function startAnimation() {
  RequestAnimDict(animDict);
  while (!HasAnimDictLoaded(animDict)) {
    // eslint-disable-next-line no-await-in-loop
    await Delay(1);
  }
  tablet = CreateObject(GetHashKey('prop_cs_tablet'), 0, 0, 0, true, true, true);
  AttachEntityToEntity(
    tablet,
    GetPlayerPed(-1),
    GetPedBoneIndex(GetPlayerPed(-1),
      57005), 0.17, 0.10, -0.13, 20.0, 180.0, 180.0, true,
    true, false, true, 1, true,
  );
  TaskPlayAnim(GetPlayerPed(-1), animDict, 'base', 8.0, -8.0, -1, 50, 0, false, false, false);
}

async function stopAnimation() {
  StopAnimTask(GetPlayerPed(-1), animDict, 'base', 8.0);
  DeleteEntity(tablet);
}

function toggleNuiFrame(toggle: boolean) {
  if (toggle) {
    startAnimation();
  } else {
    stopAnimation();
  }
  SetNuiFocus(toggle, toggle);
  SendNUIMessage({
    action: 'setVisible',
    data: toggle,
  });
}

RegisterCommand('mdw', (source: any, args: any) => {
  // console.log('Opening ui');
  nuiOpen = !nuiOpen;

  toggleNuiFrame(nuiOpen);
}, false);

RegisterCommand('mdw-r', (source: any, args: any) => {
  nuiOpen = false;
  toggleNuiFrame(false);
  SendNUIMessage({
    action: 'refresh',
    data: true,
  });
}, false);

RegisterNuiCallbackType('hideFrame');
on('__cfx_nui:hideFrame', (_: any, cb: (returnData: any) => void) => {
  nuiOpen = !nuiOpen;
  toggleNuiFrame(false);
  cb({ ok: true });
});
