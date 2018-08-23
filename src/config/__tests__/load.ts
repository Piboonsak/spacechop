import path from 'path';
import load from '../load';

jest.mock('../../lib/console');

describe('should load config.yml', () => {
  describe('invalid config', () => {
    it('should return null on missing file', () => {
      const filename = path.join(__dirname, 'assets/config.yml');
      expect(load(filename)).toBe(null);
    });

    it('should return null on empty', () => {
      const filename = path.join(__dirname, 'assets/empty.yml');
      expect(load(filename)).toBe(null);
    });

    it('should return null on bad yaml', () => {
      const filename = path.join(__dirname, 'assets/bad.yml');
      expect(load(filename)).toBe(null);
    });
  });

  describe('valid config', () => {
    it('should return config', () => {
      const filename = path.join(__dirname, 'assets/valid.yml');
      expect(load(filename)).toMatchSnapshot();
    });
  });
});
