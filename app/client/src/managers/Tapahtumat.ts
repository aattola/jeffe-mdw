import { Delay } from '@app/shared/functions';
import { emitNetPromise } from '@app/shared/events';

RegisterNuiCallbackType('tapahtumat');

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

    RegisterCommand(
      'devtapahtumat',
      () => {
        this.handleTapahtumat('bruh', () => null);
      },
      false,
    );
  }

  async handleTapahtumat(data: any, cb: (cbData: any) => void) {
    const res = await emitNetPromise('jeffe-patja:tapahtumat', 'sickomamba');
    cb({ res });
  }
}

export default TapahtumatManager;
