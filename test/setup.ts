import {expect} from '@hapi/code';
import * as Lab from '@hapi/lab';

const lab = Lab.script();
export {lab};

lab.experiment('Test Setup', () => {
  const MONGO_URI = process.env.MONGO_URI;
  const MONGO_DB = process.env.MONGO_DB;

  lab.test('Expected NODE_ENV is test', () => {
    expect(process.env.NODE_ENV).to.equal('test');
  });

  lab.test('Expected MONGO_URL set as test', () => {
    const nodeEnv = process.env.NODE_ENV;
    const MONGO_URL = `${MONGO_URI}/${MONGO_DB}-${nodeEnv}`;

    process.env.MONGO_URL = MONGO_URL;
    expect(process.env.MONGO_URL).to.equal(MONGO_URL);
  });
});
