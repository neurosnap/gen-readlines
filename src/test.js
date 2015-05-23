'use strict';

import Readlines from './index';

(async function() {
  let rl = await new Readlines('./test.txt');
  console.log(rl);
  let lines = rl.lines();
  console.log(lines);

  for (let line of lines) {
    console.log(line.toString());
  }
  console.log('=========');
  console.log('all done!');
})();