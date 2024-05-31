import { Entity } from './../utilities/pathUtilities.js';
//import { configData } from './config';
const root = new Entity('p8', null, true);
const srcDir = new Entity('src', root, true);
const distDir = new Entity('dist', root, true);
const srcIndexScript = new Entity('index.ts', srcDir, false);
const srcUilitiesDir = new Entity('utilities', srcDir, true);
const srcAssetsDir = new Entity('assets', srcDir, true);
const srcViewsDir = new Entity('views', srcDir, true);
const srcIndexHtml = new Entity('index.html', srcViewsDir, false);
const srcTest1Html = new Entity('test1.html', srcViewsDir, false);
const srcError404Html = new Entity('error404.html', srcViewsDir, false);
const srcAssetsScriptsDir = new Entity('scripts', srcAssetsDir, true);
const srcAppXScript = new Entity('appX.ts', srcAssetsScriptsDir, false);
const srcPathUtilities = new Entity('pathUtilities.ts', srcUilitiesDir, false);
const distIndexScript = new Entity('index.js', distDir, false);
const distUilitiesDir = new Entity('uilities', distDir, true);
const distAssetsDir = new Entity('assets', distDir, true);
const distAssetsScriptsDir = new Entity('scripts', distAssetsDir, true);
const distAppXScript = new Entity('appX.js', distAssetsScriptsDir, false);
const distPathUtilities = new Entity('pathUtilities.js', distUilitiesDir, false);
var SrcEntitiesNames;
(function (SrcEntitiesNames) {
    SrcEntitiesNames["srcDir"] = "src";
    SrcEntitiesNames["indexScript"] = "index.ts";
    SrcEntitiesNames["viewsDir"] = "views";
    SrcEntitiesNames["utilitiesDir"] = "utilities";
    SrcEntitiesNames["assetsDir"] = "assets";
    SrcEntitiesNames["assetsScriptsDir"] = "scripts";
    SrcEntitiesNames["indexHtml"] = "index.html";
    SrcEntitiesNames["test1Html"] = "test1.html";
    SrcEntitiesNames["error404Html"] = "error404.html";
    SrcEntitiesNames["pathUtilities"] = "pathUtilities.ts";
    SrcEntitiesNames["appXScript"] = "appX.ts";
})(SrcEntitiesNames || (SrcEntitiesNames = {}));
var DistEntitiesNames;
(function (DistEntitiesNames) {
    DistEntitiesNames["distDir"] = "dist";
    DistEntitiesNames["indexScript"] = "index.js";
    DistEntitiesNames["utilitiesDir"] = "utilities";
    DistEntitiesNames["assetsDir"] = "assets";
    DistEntitiesNames["assetsScriptsDir"] = "scripts";
    DistEntitiesNames["pathUtilities"] = "pathUtilities.js";
    DistEntitiesNames["appXScript"] = "appX.js";
})(DistEntitiesNames || (DistEntitiesNames = {}));
function getSrcEntity(name) {
    switch (name) {
        case SrcEntitiesNames.srcDir:
            return srcDir;
        case SrcEntitiesNames.indexScript:
            return srcIndexScript;
        case SrcEntitiesNames.utilitiesDir:
            return srcUilitiesDir;
        case SrcEntitiesNames.assetsDir:
            return srcAssetsDir;
        case SrcEntitiesNames.assetsScriptsDir:
            return srcAssetsScriptsDir;
        case SrcEntitiesNames.pathUtilities:
            return srcPathUtilities;
        case SrcEntitiesNames.appXScript:
            return srcAppXScript;
        case SrcEntitiesNames.indexHtml:
            return srcIndexHtml;
        case SrcEntitiesNames.test1Html:
            return srcTest1Html;
        case SrcEntitiesNames.error404Html:
            return srcError404Html;
        case SrcEntitiesNames.viewsDir:
            return srcViewsDir;
    }
}
function getDistEntity(name) {
    switch (name) {
        case DistEntitiesNames.distDir:
            return distDir;
        case DistEntitiesNames.indexScript:
            return distIndexScript;
        case DistEntitiesNames.utilitiesDir:
            return distUilitiesDir;
        case DistEntitiesNames.assetsDir:
            return distAssetsDir;
        case DistEntitiesNames.assetsScriptsDir:
            return distAssetsScriptsDir;
        case DistEntitiesNames.pathUtilities:
            return distPathUtilities;
        case DistEntitiesNames.appXScript:
            return distAppXScript;
    }
}
function getEntity(dir, name) {
    var getterMethod = dir === "src" ? getSrcEntity : getDistEntity;
    return getterMethod(name);
}
function getPath(dir, entityName) {
    return getEntity(dir, entityName).getFullPath();
}
export const pathHelper = {
    getPath: getPath,
    getEntity: getEntity,
    rootEntity: root,
    directories: { src: srcDir, dist: distDir },
    entitiesNames: { src: SrcEntitiesNames, dist: DistEntitiesNames },
    Entity: Entity,
    SrcEntitiesNames: SrcEntitiesNames,
    DistEntitiesNames: DistEntitiesNames,
};
console.log(root.toDetailedString());
