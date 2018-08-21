import { spawn } from 'duplex-child-process';
import { Stream } from 'stream';


export default async (stream: Stream): Promise<any> => new Promise((resolve, reject) => {
  const proc = spawn('magick', ['-', 'json:']);
  stream.pipe(proc);
  const buffer = [];
  proc.on('data', (chunk) => {
    buffer.push(chunk);
  });
  proc.on('end', () => {
    let data = Buffer.concat(buffer).toString();
    // fix issues with convert json.
    // replace -nan with NaN
    data = data.replace(/\-nan/g, 'null');
    try {
      const json = JSON.parse(data);
      const [{ image }] = json;
      resolve(image);
    } catch (err) {
      console.error(err);
      console.error(data);
      return null;
    }
  });
});
