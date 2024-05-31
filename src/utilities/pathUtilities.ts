import path from 'path';


export class Entity {

    private directory: Entity|null;
    private dirDetails: {path: string, name: string};
    private name: string;
    private capable: boolean;
    private children: Map<string, Entity> | null;
    private isRootDirectory: boolean;
    private id: number = -1;
    private latestId: number = -1;

    public static GET_ROOT_PATH() : string {
        return 'C:/Users/ilayb/Codes/Projects/Subjects/WebSocket/projects';
    }

    constructor(name: string, directory: Entity|null, isCapable: boolean) {
        this.name = name;
        this.dirDetails = {path: '', name: ''};
        this.capable = isCapable;
        if (this.capable) {
            this.children = new Map<string, Entity>();
            this.latestId = 0;
            this.id = 0;
        } else {
            this.children = null;
            this.latestId = -1;
            this.id = -1;
        }
        if (!directory) {
            this.isRootDirectory = true;
            this.directory = null;
            this.dirDetails = {path: Entity.GET_ROOT_PATH(), name: Entity.GET_ROOT_PATH().split(path.sep).pop() || ''};
            this.id = 0;
        } else {
            this.isRootDirectory = false;
            try {
                if (directory && !directory.capable) {
                    throw new Error(`Entity ${directory.getFullPath()} is not capable of holding entities`);
                }
                if (directory && directory.hasChild(name)) {
                    throw new Error(`Entity with name ${name} already exists`);
                }
                this.directory = directory;
            } catch (error: any) {
                this.directory = null;
                console.error(error.message);
            }
            this.dirDetails.path = directory?.getFullPath() || '';
            this.dirDetails.name = directory?.name || '';
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

    getNameWithoutExtension() {
        if (this.capable) {
            return this.name;
        }
        return this.name.split('.').slice(0, -1).join('.');
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

    isRoot() : boolean {
        return this.isRootDirectory;
    }

    setName(name: string) {
        this.name = name;
        if (this.directory) {
            var directory = this.directory;
            var id = this.id;
            directory.removeChild(this.getName());
            directory.addChild(this);
            this.id = id;
        }
        this.reloadDirectory()
    }

    private reloadDirectory() {
        if (this.directory) {
            if (this.directory.name !== this.dirDetails.name || this.directory.getFullPath() !== this.dirDetails.path) {
                this.setDirectory(this.directory);
            }
        }
        if (this.children) {
            this.children.forEach((child) => {
                child.reloadDirectory();
            });
        }
    }

    private setDirectoryDetails(dirDetails: {path: string, name: string}) {
        this.dirDetails = dirDetails;
    }

    private setDirectory(dir: Entity|null) {
        this.directory = dir;
        this.dirDetails = {path: dir?.getFullPath() || '', name: dir?.name || ''};
    }

    move(newDir: Entity|null) {
        try {
            if (newDir && !this.capable) {
                throw new Error(`Entity ${this.getFullPath()} is not capable of holding entities`);
            }
            if (!newDir) {
                this.setDirectory(null);
                this.setDirectoryDetails({path: "", name: ""});
                return;
            }   
            if (newDir.hasChild(this.getName())) {
                throw new Error(`Entity with name ${this.getName()} already exists`);
            }
            if (this.hasDirectory()) {
                this.getDirectory()?.removeChild(this.getName());
            }
            newDir.addChild(this);
            this.setDirectory(newDir);
            this.setDirectoryDetails({path: newDir.getFullPath(), name: newDir.name});
            if (this.hasChildren()) {
                this.getChildren().forEach((child) => {
                    child.move(this);
                });
            }
        } catch (error: any) {
            console.error(error.message);
        }
    }

    private loadChildId(child: Entity) {
        this.tryChildren(() => {
            this.latestId++;
            child.id = this.latestId;
        });
    }

    setCapable(isCapable: boolean) {
        this.capable = isCapable;
        this.children = this.capable ? new Map<string, Entity>() : null;
    }

    hasDirectory() {
        return this.dirDetails.path !== '' && !this.isRootDirectory;
    }

    private tryChildren(callback: Function) : any {
        try {
            if (!this.capable) {
                throw new Error(`Entity ${this.getFullPath()} is not capable of holding entities`);
            }
            if (!this.children) {
                this.children = new Map<string, Entity>();
            }
            var results = callback();
            return results;
        } catch (error: any) {
            console.error(error.message);
            return null;
        }
    }
    
    hasChildren() {
        return this.children !== null && this.children.size > 0;
    }
    
    hasChild(name: string): boolean {
        return this.tryChildren(() => {
            return this.children!.has(name);
        });
    }

    getChildById(id: number): Entity|null {
        return this.tryChildren(() => {
            for (let child of Array.from(this.children!.values()) as Entity[]) {
                if (child.getId() === id) {
                    return child;
                }
            }
            throw new Error(`Entity with id ${id} does not exist`);
        });
    }

    getChild(name: string): Entity|null {
        return this.tryChildren(() => {
            if (!this.children!.has(name)) {
                throw new Error(`Entity with name ${name} does not exist`);
            }
            return this.children!.get(name);
        });
    }

    addChild(entity: Entity): void {
        this.tryChildren(() => {
            if (this.children!.has(entity.getName())) {
                throw new Error(`Entity with name ${entity.getName()} already exists`);
            }
            this.children!.set(entity.getName(), entity);
            this.loadChildId(entity);
        });
    }

    removeChild(name: string): void {
        this.tryChildren(() => {
            if (!this.children!.has(name)) {
                throw new Error(`Entity with name ${name} does not exist`);
            }
            this.children!.delete(name);
        });
    }

    getChildren(): Map<string, Entity> {
        return this.tryChildren(() => {
            return this.children!;
        });
    }

    childCount(): number {
        return this.tryChildren(() => {
            return this.children!.size;
        });
    }

    toString(indent: string = ''): string {
        let result = `${indent}${this.name}\n`;
        if (this.hasChildren()) {
            this.getChildren().forEach((child) => {
                result += child.toString(indent + '  ');
            });
        }
        return result;
    }

    toDetailedString(indent: string = '', isLast: boolean = true): string {
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


   // console.log(root.toDetailedString());

}