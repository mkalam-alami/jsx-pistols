import * as fs from 'fs';
import { promisify } from 'util';

export const pathExists = (path: fs.PathLike) => {
  return new Promise((resolve, _reject) => {
    fs.access(path, (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  })
}

export const readFile = promisify(fs.readFile);
