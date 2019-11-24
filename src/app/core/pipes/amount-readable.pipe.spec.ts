import { AmountReadablePipe } from './amount-readable.pipe';

describe('AmountReadablePipe', () => {
  it('create an instance', () => {
    const pipe = new AmountReadablePipe();
    expect(pipe).toBeTruthy();
  });
});
