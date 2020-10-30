/// <reference types="node" />
import * as fs from 'fs';
export declare const pathExists: (path: fs.PathLike) => Promise<unknown>;
export declare const readFile: typeof fs.readFile.__promisify__;
