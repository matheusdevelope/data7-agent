import WatchPatch from '../controllers/watch.patch';

//todo: create test jest
export default class WatchPatchTest {
  constructor() {
    this.initialize();
  }

  private async initialize() {}

  async exec() {
    const pathc = '/Users/cesar-carlos/temp';
    const _watchPatch = new WatchPatch(pathc);
    let _count = 0;

    _watchPatch.listen((cobrancas, filename) => {
      _count++;
      console.log(_count, filename);
    });
  }
}
