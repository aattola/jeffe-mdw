import { Delay } from '@app/shared/functions';
import { emitNetPromise } from '@app/shared/events';

RegisterNuiCallbackType('tapahtumat');
RegisterNuiCallbackType('tallennaTapahtuma');
RegisterNuiCallbackType('uusiTapahtuma');
RegisterNuiCallbackType('poistaTapahtuma');

class TapahtumatManager {
  protected static instance: TapahtumatManager;

  static getInstance(): TapahtumatManager {
    if (!TapahtumatManager.instance) {
      TapahtumatManager.instance = new TapahtumatManager();
    }

    return TapahtumatManager.instance;
  }

  constructor() {
    on('__cfx_nui:tapahtumat', (data: any, cb: (responseData: any) => Promise<void>) => this.handleTapahtumat(data, cb));
    on('__cfx_nui:tallennaTapahtuma', (data: any, cb: (responseData: any) => Promise<void>) => this.handleTapahtumaSave(data, cb));
    on('__cfx_nui:uusiTapahtuma', (data: any, cb: (responseData: any) => Promise<void>) => this.handleNewTapahtuma(data, cb));
    on('__cfx_nui:poistaTapahtuma', (data: any, cb: (responseData: any) => Promise<void>) => this.handleDeleteTapahtuma(data, cb));

    RegisterCommand(
      'devtapahtumat',
      () => {
        this.handleTapahtumat('bruh', () => null);
      },
      false,
    );
  }

  async handleDeleteTapahtuma(data: any, cb: (cbData: any) => void) {
    console.log('deltetapahtumadata', data);
    const res = await emitNetPromise('jeffe-patja:poistaTapahtuma', data);
    cb({ res });
  }

  async handleNewTapahtuma(data: any, cb: (cbData: any) => void) {
    console.log('newtapahtumadata', data);
    const res = await emitNetPromise('jeffe-patja:uusiTapahtuma', data);
    cb({ res });
  }

  async handleTapahtumaSave(data: any, cb: (cbData: any) => void) {
    console.log('tapahtumadata', data);
    const res = await emitNetPromise('jeffe-patja:tallennaTapahtuma', data);
    cb({ res });
  }

  async handleTapahtumat(data: any, cb: (cbData: any) => void) {
    const res = await emitNetPromise('jeffe-patja:tapahtumat', data);
    cb({ res });
  }
}

export default TapahtumatManager;
