import { onNetPromise } from '@app/shared/events';
// @ts-ignore
import { fetchAll } from 'fivem-mysql-async-js';

console.log('Hello from server');

onNetPromise('jeffe-patja:tapahtumat', async (data, cb, source) => {
  console.log('tapahtumat data', data);

  const dbRes = await fetchAll('SELECT * FROM patja_tapahtumat');

  cb({ ok: true, data: dbRes }, source);
});
