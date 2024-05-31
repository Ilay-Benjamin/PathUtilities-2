import path from 'path';
import { Entity } from './../utilities/pathUtilities';
//import { configData } from './config';



const root = new Entity('p8', null, true);

const srcDir = new Entity('src', root, true);
const distDir = new Entity('dist', root, true);

const srcIndexScript = new Entity('index.ts', srcDir, false);
const srcUilitiesDir = new Entity('utilities', srcDir, true);
const srcAssetsDir = new Entity('assets', srcDir, true);

const srcAssetsScriptsDir = new Entity('scripts', srcAssetsDir, true);

const srcAppXScript = new Entity('appX.ts', srcAssetsScriptsDir, false);

const srcPathUtilities = new Entity('pathUtilities.ts', srcUilitiesDir, false);

const distIndexScript = new Entity('index.js', distDir, false);
const distUilitiesDir = new Entity('uilities', distDir, true);
const distViewsDir = new Entity('views', distDir, true);
const distAssetsDir = new Entity('assets', distDir, true);

const distAssetsScriptsDir = new Entity('scripts', distAssetsDir, true);

const distAppXScript = new Entity('appX.js', distAssetsScriptsDir, false);

const distPathUtilities = new Entity('pathUtilities.js', distUilitiesDir, false);

const distIndexHtml = new Entity('index.html', distViewsDir, false);

export const files = {
    src: {
        index: srcDir.getChild('index.ts'),
        utilities: {
            pathUtilities: srcUilitiesDir.getChild('pathUtilities.ts')
        },
        assets: {
            scripts: {
                appX: srcAssetsScriptsDir.getChild('appX.ts')
            }
        }
    },
    dist: {
        index: distDir.getChild('index.js'),
        utilities: {
            pathUtilities: distUilitiesDir.getChild('pathUtilities.js')
        },
        views: {
            index: distViewsDir.getChild('index.html')
        },
        assets: {
            scripts: {
                appX: distAssetsScriptsDir.getChild('appX.js')
            }
        }
    }
}

console.log(root.toDetailedString());