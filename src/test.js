'use strict';

import Readlines from './index';

(async function() {
  let rl = new Readlines();

  await rl.open('./test.txt');

  for (let line of rl.lines()) {
    console.log(line.toString());
  }

  console.log('=========');

  await rl.close();
  console.log('All done!');
})();