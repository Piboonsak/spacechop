import { requestHandler } from './../../spacechop';
import { Config } from '../../types/Config';
import assetsFolder from './../assets/dirname';
import path from 'path';
import pathToRegex from 'path-to-regexp';
import { Request, Response } from './../utils/expressMocks';
import { PassThrough } from 'stream';

/**
 * Tests in this file use the full spacechop implementation by mocking Express 
 * Response and Requests.
 */
describe('Configured storage', () => {
  
  describe('Image exists in storage cache', () => {
    const p = '/:preset/:image'
    const config: Config = {
      sources: [{
        volume: {
          root: path.join(assetsFolder, ':image')
        }
      }],
      paths: [p],
      presets: {
        t_original: {
          steps: []
        }
      },
      storage: {
        s3: {
          access_key_id: 'xxx',
          bucket_name: 'yy',
          path: '',
          region: 'nyc2',
          secret_access_key: 'zz'
        }
      }
    };
  
    const sources = [
      {
        exists: jest.fn(),
        stream: jest.fn(),
      }
    ];
    const mockedStorageResponse = { stream: new PassThrough(), contentType: 'image/jpeg' };
    const storage = {
      exists: jest.fn(() => Promise.resolve(true)),
      stream: jest.fn(() => Promise.resolve(mockedStorageResponse)),
      upload: jest.fn(),
    };

    const keys = [];
    // populates `keys` array
    pathToRegex(p, keys);
    const handler = requestHandler(config, keys, sources, storage);

    let request;
    let response;
    beforeAll(async () => {
      request = new Request();
      response = new Response();
      request.setParams(0, 't_original');
      request.setParams(1, 'grid.png');
      await handler(request, response);
    })
    it('should check storage', () => {
      expect(storage.exists).toHaveBeenCalled();
      expect(storage.stream).toHaveBeenCalled();
    });
    it('should not check source', () => {
      expect(sources[0].exists).not.toHaveBeenCalled();
      expect(sources[0].stream).not.toHaveBeenCalled();
    });
    it('should set content type as returned from storage', () => {
      expect(response.set).toBeCalledWith('Content-Type', mockedStorageResponse.contentType);
    });
    it('should not call storage .upload', () => {
      expect(storage.upload).not.toHaveBeenCalled();
    });
  })
})
