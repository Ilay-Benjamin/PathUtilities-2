import path from 'path';

// Get the current directory of the module

const rootPath = 'websocket/projects/p8';
const dirPath = 'dist/views';
const fileName = 'index.html';

// Compute the full path
export const fullPath = path.join(rootPath, dirPath, fileName);


