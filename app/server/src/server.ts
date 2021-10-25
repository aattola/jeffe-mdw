import { onNetPromise } from '@app/shared/events';
// @ts-ignore
// eslint-disable-next-line import/no-extraneous-dependencies
import { fetchAll, execute } from 'fivem-mysql-async-js';
import './router';

console.log('Hello from server');

onNetPromise('jeffe-patja:tapahtumat', async (data, cb, source) => {
  if (data && data.id) {
    const dbRes = await fetchAll('SELECT * FROM patja_tapahtumat WHERE id = @id', {
      '@id': data.id,
    });

    return cb({ ok: true, data: dbRes }, source);
  }
  const dbRes = await fetchAll('SELECT * FROM patja_tapahtumat ORDER BY id DESC LIMIT 20');

  return cb({ ok: true, data: dbRes }, source);
});

onNetPromise('jeffe-patja:tallennaTapahtuma', async (data, cb, source) => {
  const dbRes = await execute('UPDATE patja_tapahtumat t SET t.name = @name, t.description = @desc, t.data = @data, t.rikolliset = @rikolliset WHERE t.id = @id', {
    '@name': data.name,
    '@desc': data.description,
    '@data': data.data,
    '@rikolliset': data.rikolliset,
    '@id': data.id,
  });

  cb({ ok: true, data: dbRes }, source);
});

onNetPromise('jeffe-patja:poistaTapahtuma', async (data, cb, source) => {
  if (!data && !data.id) return cb({ ok: false }, source);
  const dbRes = await execute('DELETE FROM patja_tapahtumat WHERE id = @id', {
    '@id': data.id,
  });
  return cb({ ok: true, data: dbRes }, source);
});

onNetPromise('jeffe-patja:uusiTapahtuma', async (data, cb, source) => {
  const dbRes = await execute('INSERT INTO patja_tapahtumat (name, description, data, timestamp, rikolliset) VALUES (null, null, \'{}\', DEFAULT, \'{}\');');
  cb({ ok: true, data: dbRes }, source);
});
