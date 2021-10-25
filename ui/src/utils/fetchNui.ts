/**
 * Simple wrapper around fetch API tailored for CEF/NUI use. This abstraction
 * can be extended to include AbortController if needed or if the response isn't
 * JSON. Tailor it to your needs.
 *
 * @param eventName - The endpoint eventname to target
 * @param data - Data you wish to send in the NUI Callback
 *
 * @return returnData - A promise for the data sent back by the NuiCallbacks CB argument
 */

export async function fetchNui<T = any>(
  eventName: string,
  data?: any,
  fetchServer: boolean = true,
): Promise<T> {
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(data),
  };

  const { ip } = (window as any);
  const realIp = ip ?? 'localhost';
  let resourceName = (window as any).GetParentResourceName
    ? `https://${(window as any).GetParentResourceName()}`
    : `http://${realIp}:3005/nui/jeffe-patja`;
  // if (resourceName === false) {
  //   console.log(`[fetchNui] ${eventName} peruutettiin koska selain`);
  //   return { error: true, msg: 'error' };
  // }

  if (fetchServer) {
    const nimi = (window as any).GetParentResourceName
      ? (window as any).GetParentResourceName()
      : 'jeffe-patja';

    resourceName = `http://${realIp}:3005/nui/${nimi}`;
  }

  const resp = await fetch(`${resourceName}/${eventName}`, options);

  const respFormatted = await resp.json().catch((err) => {
    const msg = {
      error: true,
      err,
      errorMsgForDev: `YOU PROBABLY FORGOT TO EXECUTE CB FUNCTION OR REGISTER EVENT ON CLIENT: ${eventName}`,
    };

    return msg;
  });

  if (!respFormatted.res.ok) {
    if (eventName !== 'ip') {
      const msg = {
        error: true,
        errorMsgForDev: 'res !ok',
        data: respFormatted,
        requestData: {
          eventName,
          resourceName,
          options,
        },
      };

      throw msg;
    }
    console.log('[fetchNui] Getting ip failed');
  }

  return respFormatted;
}
