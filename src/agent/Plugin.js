import { default as AgentLogger } from './AgentLogger';
import { default as EventEmitter } from 'events';
let log = AgentLogger.log();

export class Plugin extends EventEmitter {
    constructor() {
        super();
        return this;
    }

    static get registeredTypes() {
        if (this.hasOwnProperty('_registeredTypeMap')) {
            return this._registeredTypeMap;
        } else {
            this._registeredTypeMap = new Map();
            return this._registeredTypeMap;
        }
    }

    static isRegistered(clazzname) {
        return this.registeredTypes.has(clazzname);
    }

    static register(clazzname, clazz) {
        if (!(this.isRegistered(clazzname) && clazz.prototype instanceof this)) {
            this.registeredTypes.set(clazzname, clazz);
            log.info('Registered ' + this.name + ': ' + clazzname);
        } else {
            log.error('Cannot Register ' + clazzname + ', Invalid Type. Must be a subclass of ' + this.name);
        }
    }

    /**
     *
     * @param {string} clazzname - Class Name to Create
     * @param {*} options - Object of Options to pass into Class
     */
    static create(clazzname, ...options) {
        if (!clazzname) return null;
        if (!this.registeredTypes.has(clazzname)) {
            log.error('Cannot Create Instance. Unknown Subclass: ' + clazzname);
            return null;
        }

        let clazz = this.registeredTypes.get(clazzname);
        let instance = new clazz(...options);
        return instance;
    }
}
