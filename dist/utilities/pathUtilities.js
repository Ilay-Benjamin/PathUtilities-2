import path from 'path';
class Entity {
    static GET_ROOT_PATH() {
        return 'C:/Users/ilayb/Codes/Projects/Subjects/WebSocket/projects';
    }
    constructor(name, directory, isCapable) {
        this.id = -1;
        this.latestId = -1;
        this.name = name;
        this.dirDetails = { path: '', name: '' };
        this.capable = isCapable;
        if (this.capable) {
            this.children = new Map();
            this.latestId = 0;
            this.id = 0;
        }
        else {
            this.children = null;
            this.latestId = -1;
            this.id = -1;
        }
        if (!directory) {
            this.isRootDirectory = true;
            this.directory = null;
            this.dirDetails = { path: Entity.GET_ROOT_PATH(), name: Entity.GET_ROOT_PATH().split(path.sep).pop() || '' };
            this.id = 0;
        }
        else {
            this.isRootDirectory = false;
            try {
                if (directory && !directory.capable) {
                    throw new Error(`Entity ${directory.getFullPath()} is not capable of holding entities`);
                }
                if (directory && directory.hasChild(name)) {
                    throw new Error(`Entity with name ${name} already exists`);
                }
                this.directory = directory;
            }
            catch (error) {
                this.directory = null;
                console.error(error.message);
            }
            this.dirDetails.path = (directory === null || directory === void 0 ? void 0 : directory.getFullPath()) || '';
            this.dirDetails.name = (directory === null || directory === void 0 ? void 0 : directory.name) || '';
            if (this.directory) {
                this.directory.addChild(this);
            }
        }
    }
    getFullPath() {
        return path.join(this.dirDetails.path, this.name);
    }
    getName() {
        return this.name;
    }
    getDirectoryDetails() {
        return this.dirDetails;
    }
    getDirectory() {
        return this.directory;
    }
    getId() {
        return this.id;
    }
    isCapable() {
        return this.capable;
    }
    isRoot() {
        return this.isRootDirectory;
    }
    setName(name) {
        this.name = name;
    }
    setDirectoryDetails(dirDetails) {
        this.dirDetails = dirDetails;
    }
    setDirectory(dir) {
        this.directory = dir;
        this.dirDetails = { path: (dir === null || dir === void 0 ? void 0 : dir.getFullPath()) || '', name: (dir === null || dir === void 0 ? void 0 : dir.name) || '' };
    }
    move(newDir) {
        var _a;
        try {
            if (newDir && !this.capable) {
                throw new Error(`Entity ${this.getFullPath()} is not capable of holding entities`);
            }
            if (!newDir) {
                this.setDirectory(null);
                this.setDirectoryDetails({ path: "", name: "" });
                return;
            }
            if (newDir.hasChild(this.getName())) {
                throw new Error(`Entity with name ${this.getName()} already exists`);
            }
            if (this.hasDirectory()) {
                (_a = this.getDirectory()) === null || _a === void 0 ? void 0 : _a.removeChild(this.getName());
            }
            newDir.addChild(this);
            this.setDirectory(newDir);
            this.setDirectoryDetails({ path: newDir.getFullPath(), name: newDir.name });
            if (this.hasChildren()) {
                this.getChildren().forEach((child) => {
                    child.move(this);
                });
            }
        }
        catch (error) {
            console.error(error.message);
        }
    }
    loadChildId(child) {
        this.tryChildren(() => {
            this.latestId++;
            child.id = this.latestId;
        });
    }
    setCapable(isCapable) {
        this.capable = isCapable;
        this.children = this.capable ? new Map() : null;
    }
    hasDirectory() {
        return this.dirDetails.path !== '' && !this.isRootDirectory;
    }
    tryChildren(callback) {
        try {
            if (!this.capable) {
                throw new Error(`Entity ${this.getFullPath()} is not capable of holding entities`);
            }
            if (!this.children) {
                this.children = new Map();
            }
            var results = callback();
            return results;
        }
        catch (error) {
            console.error(error.message);
            return null;
        }
    }
    hasChildren() {
        return this.children !== null && this.children.size > 0;
    }
    hasChild(name) {
        return this.tryChildren(() => {
            return this.children.has(name);
        });
    }
    getChildById(id) {
        return this.tryChildren(() => {
            for (let child of Array.from(this.children.values())) {
                if (child.getId() === id) {
                    return child;
                }
            }
            throw new Error(`Entity with id ${id} does not exist`);
        });
    }
    getChild(name) {
        return this.tryChildren(() => {
            if (!this.children.has(name)) {
                throw new Error(`Entity with name ${name} does not exist`);
            }
            return this.children.get(name);
        });
    }
    addChild(entity) {
        this.tryChildren(() => {
            if (this.children.has(entity.getName())) {
                throw new Error(`Entity with name ${entity.getName()} already exists`);
            }
            this.children.set(entity.getName(), entity);
            this.loadChildId(entity);
        });
    }
    removeChild(name) {
        this.tryChildren(() => {
            if (!this.children.has(name)) {
                throw new Error(`Entity with name ${name} does not exist`);
            }
            this.children.delete(name);
        });
    }
    getChildren() {
        return this.tryChildren(() => {
            return this.children;
        });
    }
    childCount() {
        return this.tryChildren(() => {
            return this.children.size;
        });
    }
    toString(indent = '') {
        let result = `${indent}${this.name}\n`;
        if (this.hasChildren()) {
            this.getChildren().forEach((child) => {
                result += child.toString(indent + '  ');
            });
        }
        return result;
    }
    toDetailedString(indent = '', isLast = true) {
        const connector = isLast ? '└── ' : '├── ';
        const childIndent = indent + (isLast ? '    ' : '│   ');
        const details = [
            `${indent}${connector}${this.name}`,
            `${childIndent}  - IsRoot: ${this.isRoot()}`,
            `${childIndent}  - HasDirectory: ${this.hasDirectory()}`,
            `${childIndent}  - Path: ${this.getFullPath()}`,
            `${childIndent}  - Capable: ${this.capable}`,
            `${childIndent}  - Directory: ${this.dirDetails.path || 'None'}`,
            `${childIndent}  - Children: ${this.hasChildren() ? this.childCount() : 'None'}`,
        ].join('\n');
        let result = `${details}\n`;
        if (this.hasChildren()) {
            const childrenArray = Array.from(this.getChildren().values());
            childrenArray.forEach((child, index) => {
                const isLastChild = index === childrenArray.length - 1;
                result += child.toDetailedString(childIndent, isLastChild);
            });
        }
        return result;
    }
}
export function main() {
    var root = new Entity('p8', null, true);
    var srcDir = new Entity('src', root, true);
    var distDir = new Entity('dist', root, true);
    var srcIndexScript = new Entity('index.ts', srcDir, false);
    var srcUilitiesDir = new Entity('utilities', srcDir, true);
    var srcPathUtilities = new Entity('pathUtilities.ts', srcUilitiesDir, false);
    var distIndexScript = new Entity('index.js', distDir, false);
    var distUilitiesDir = new Entity('Uilities', distDir, true);
    var distPathUtilities = new Entity('pathUtilities.js', distUilitiesDir, false);
    var distViewsDir = new Entity('views', distDir, true);
    var distIndexHtml = new Entity('index.html', distViewsDir, false);
    console.log(root.toDetailedString());
}
