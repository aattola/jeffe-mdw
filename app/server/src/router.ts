import express, { Request, Response } from 'express';
// @ts-ignore
import cors from 'cors';
import { emitNetPromise, onNetPromise } from '@app/shared/events';
// @ts-ignore
// eslint-disable-next-line import/no-extraneous-dependencies
import { fetchAll, execute } from 'fivem-mysql-async-js';

const app = express();
const port = 3005;

app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// eslint-disable-next-line consistent-return
app.post('/nui/jeffe-patja/:id', async (req: Request, res: Response) => {
  const eventName = req.params.id;
  const data = req.body;

  function cb(resData: any) {
    res.json({ res: resData });
  }

  if (eventName === 'rikosnimikkeet') {
    const dbRes = await fetchAll('SELECT * FROM patja_rikokset');
    return cb({ ok: true, data: dbRes });
  }

  if (eventName === 'haeraportteja') {
    if (data && data.hakusana) {
      const dbRes = await fetchAll('SELECT * FROM patja_tapahtumat WHERE name LIKE @hakusana LIMIT 20', {
        '@hakusana': `%${data.hakusana}%`,
      });

      return cb({ ok: true, data: dbRes });
    }

    return cb({ ok: false, data: null });
  }

  if (eventName === 'haerikollisia') {
    if (data && data.hakusana) {
      const dbRes = await fetchAll('SELECT * FROM patja_test_profiilit WHERE name LIKE @hakusana LIMIT 20', {
        '@hakusana': `%${data.hakusana}%`,
      });

      return cb({ ok: true, data: dbRes });
    }

    return cb({ ok: false, data: null });
  }

  if (eventName === 'etsintäkuulutukset') {
    // const dbRes = await fetchAll('SELECT * FROM patja_etsintakuulutukset ORDER BY id DESC LIMIT 100');
    const dbRes = await fetchAll('SELECT * FROM patja_etsintakuulutukset JOIN patja_test_profiilit ON patja_etsintakuulutukset.pid =  patja_test_profiilit.id');
    return cb({ ok: true, data: dbRes });
  }

  if (eventName === 'tapahtumat') {
    if (data && data.id) {
      const dbRes = await fetchAll('SELECT * FROM patja_tapahtumat WHERE id = @id', {
        '@id': data.id,
      });

      if (data.refresh) {
        if (dbRes[0].rikolliset) {
          const rikolliset = JSON.parse(dbRes[0].rikolliset);
          if (rikolliset.criminals && rikolliset.criminals[0]) {
            const uusiRikolliset: {label: string, id: number}[] = [];
            rikolliset.criminals.forEach(async (rikollinen: {label: string, id: number}, index: number) => {
              const vastaus = await fetchAll('SELECT * FROM patja_test_profiilit WHERE id = @id', {
                '@id': rikollinen.id,
              });

              uusiRikolliset.push({
                label: vastaus[0].name,
                id: vastaus[0].id,
              });

              if (index === (rikolliset.criminals.length - 1)) {
                dbRes[0].rikolliset = JSON.stringify({
                  ...rikolliset,
                  criminals: uusiRikolliset,
                });

                return cb({ ok: true, data: dbRes });
              }
            });
            return;
          }
          return cb({ ok: true, data: dbRes });
        }
      }

      return cb({ ok: true, data: dbRes });
    }
    const dbRes = await fetchAll('SELECT * FROM patja_tapahtumat ORDER BY id DESC LIMIT 40');
    return cb({ ok: true, data: dbRes });
  }

  if (eventName === 'tallennaProfiili') {
    if (data && !data.id) {
      const tempId = Date.now();
      await execute('INSERT INTO patja_test_profiilit (name) VALUES (@tempid);', {
        '@tempid': tempId,
      });

      const dbRes = await fetchAll('SELECT * FROM patja_test_profiilit WHERE name = @tempid', {
        '@tempid': tempId,
      });

      await execute('UPDATE patja_test_profiilit t SET name = @name, cid = @cid, image = @image, description = @desc WHERE t.name = @tempid', {
        '@name': data.name,
        '@cid': data.cid,
        '@image': data.image,
        '@desc': data.description,
        '@tempid': tempId,
      });

      return cb({ ok: true, data: dbRes });
    }

    if (data && data.id) {
      const dbRes = await execute('UPDATE patja_test_profiilit t SET name = @name, cid = @cid, image = @image, description = @desc WHERE t.id = @id', {
        '@name': data.name,
        '@cid': data.cid,
        '@image': data.image,
        '@desc': data.description,
        '@id': data.id,
      });

      return cb({ ok: true, data: dbRes });
    }
  }

  if (eventName === 'tallennaTapahtuma') {
    if (data && !data.id) {
      const tempId = Date.now();
      await execute('INSERT INTO patja_tapahtumat (name, description, data, timestamp, rikolliset) VALUES (@tempid, null, \'{}\', DEFAULT, \'{}\');', {
        '@tempid': tempId,
      });

      const dbRes = await fetchAll('SELECT * FROM patja_tapahtumat WHERE name = @tempid', {
        '@tempid': tempId,
      });

      await execute('UPDATE patja_tapahtumat t SET t.name = @name, t.description = @desc, t.data = @data, t.rikolliset = @rikolliset WHERE t.name = @tempid', {
        '@name': data.name ?? '',
        '@desc': data.description ?? '',
        '@data': data.data ?? {},
        '@rikolliset': data.rikolliset ?? {},
        '@tempid': tempId,
      });

      return cb({ ok: true, data: dbRes });
    }
    if (!data && !data.id) return cb({ ok: false, error: 'data puuttuu' });

    let rikollisetString = '_';
    const rikollisetArray = JSON.parse(data?.rikolliset)?.criminals;
    if (rikollisetArray) {
      rikollisetArray.forEach((rikollinen: {label: string, id: number}) => {
        rikollisetString += `${rikollinen.id}_`;
      });
    }

    const dbRes = await execute('UPDATE patja_tapahtumat t SET t.name = @name, t.description = @desc, t.data = @data, t.rikolliset = @rikolliset, t.rikollisetId = @rikollisetId WHERE t.id = @id', {
      '@name': data.name,
      '@desc': data.description,
      '@data': data.data,
      '@rikolliset': data.rikolliset,
      '@id': data.id,
      '@rikollisetId': rikollisetString,
    });

    return cb({ ok: true, data: dbRes });
  }

  if (eventName === 'poistaTapahtuma') {
    if (!data && !data.id) return cb({ ok: false, error: 'data puuttuu' });
    const dbRes = await execute('DELETE FROM patja_tapahtumat WHERE id = @id', {
      '@id': data.id,
    });
    return cb({ ok: true, data: dbRes });
  }

  if (eventName === 'uusiTapahtuma') {
    const dbRes = await execute('INSERT INTO patja_tapahtumat (name, description, data, timestamp, rikolliset) VALUES (null, null, \'{}\', DEFAULT, \'{}\');');
    return cb({ ok: true, data: dbRes });
  }

  if (eventName === 'profiilit') {
    if (data && data.id) {
      const dbRes = await fetchAll('SELECT * FROM patja_test_profiilit WHERE id = @id', {
        '@id': data.id,
      });

      const ressi = await fetchAll('SELECT rikolliset, id FROM patja_tapahtumat WHERE rikollisetId LIKE @id', {
        '@id': `%_${data.id}_%`,
      });

      const ressiRes = ressi[0] ? ressi.map((ress: any) => ({ id: ress.id, rikolliset: JSON.parse(ress.rikolliset) })) : [];

      return cb({ ok: true, data: dbRes, rikokset: ressiRes });
    }

    const dbRes = await fetchAll('SELECT * FROM patja_test_profiilit ORDER BY id DESC LIMIT 40');
    return cb({ ok: true, data: dbRes });
  }

  cb({ ok: false, error: 'no event handler found' });
});

app.listen(port, () => {
  console.log(`[router]: at http://localhost:${port}`);
});
