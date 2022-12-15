/* I have not gone terribly heavy on testing in this application, as it is pretty small.
However, I am a believer in testing, and in an enterprise environment, I would be happy to
participate. I wanted to show that I knew how to do it using a framework I haven't used before.
*/

import { App } from './../../src/app';
describe('App class', () => {
  const app: App = new App();
  test('App component has game object', () => {
    expect(app.game !== null);
  });
});
