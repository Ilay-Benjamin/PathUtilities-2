import { pathHelper } from './../inc/bootstrap';
var RoutesNames;
(function (RoutesNames) {
    RoutesNames["index"] = "index";
    RoutesNames["test1"] = "test1";
    RoutesNames["error"] = "error404";
})(RoutesNames || (RoutesNames = {}));
const routesNicknames = new Map([
    [RoutesNames.index, [
            'index',
            'index.html',
            'home',
            'home.html',
            '/',
        ]],
    [RoutesNames.test1, [
            'test1',
            'test1.html',
            'test',
            'test.html',
        ]],
    [RoutesNames.error, [
            'error',
            'error.html',
            'error404',
            'error404.html',
            '404',
            '404.html'
        ]]
]);
function getRouteName(nickname) {
    if (Array.from(routesNicknames.get(RoutesNames.index).values()).includes(nickname)) {
        return RoutesNames.index;
    }
    else if (Array.from(routesNicknames.get(RoutesNames.test1).values()).includes(nickname)) {
        return RoutesNames.test1;
    }
    else {
        return RoutesNames.error;
    }
}
function getRouteNicknames(name) {
    switch (name) {
        case RoutesNames.index:
            return routesNicknames.get(RoutesNames.index);
        case RoutesNames.test1:
            return routesNicknames.get(RoutesNames.test1);
        case RoutesNames.error:
            return routesNicknames.get(RoutesNames.error);
        default:
            return routesNicknames.get(RoutesNames.error);
    }
}
function getFilePath(name) {
    switch (name) {
        case RoutesNames.index:
            return pathHelper.getEntity('src', pathHelper.SrcEntitiesNames.indexHtml).getFullPath();
        case RoutesNames.test1:
            return pathHelper.getEntity('src', pathHelper.SrcEntitiesNames.test1Html).getFullPath();
        case RoutesNames.error:
            return pathHelper.getEntity('src', pathHelper.SrcEntitiesNames.error404Html).getFullPath();
        default:
            return pathHelper.getEntity('src', pathHelper.SrcEntitiesNames.error404Html).getFullPath();
    }
}
export function manageRouter(app) {
    console.log("\n\nManageRouter-> error-Route-Nicknames: ", getRouteNicknames(RoutesNames.error) + '\n\n');
    var routesNames = Array.from(Object.keys(RoutesNames));
    console.log("ManageRouter-> routesNames: ", routesNames + '\n');
    for (let routeName of routesNames) {
        console.log("for(routesNames)-> routeName: ", routeName + '\n');
        var routeNicknames = getRouteNicknames(routeName);
        console.log("for(routesNames)-> routeNicknames: ", routeNicknames + '\n');
        for (let routeNickname of routeNicknames) {
            console.log("for(routeNicknames)-> routeNickname: ", routeNickname + '\n');
            app.get(`/${routeNickname}`, (req, res) => {
                res.sendFile(getFilePath(routeName));
            });
        }
    }
    app.get('*', (req, res) => {
        res.sendFile(getFilePath(RoutesNames.error));
    });
}
