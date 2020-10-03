const startDatabase = require('../../project/database');
const openstackApi = require('../../project/openstackApi');
const RouterPort = require('./RouterPort')

const database = startDatabase();
const api = openstackApi();


module.exports = class Router {
    constructor(data){
        this.id = data.id;
        this.position = data.position
        this.name = data.name
        this.openstackId = data.openstackID
        this.notifyAll = data.notifyAll
        this.startPorts(data.ports)
        this.type = 'Router'
    }
    status = 0;
    project_id;
    ports = {}

    getPort = (id) => this.ports[id];

    startPorts(ports){
        if(ports){
        Object.values(ports).forEach(port => {
            this.createPort({...port, parent: this})
        })
        }
    }

    async getStatus(data){
        const router = await api.getRouter(this.openstackId, data.user.token)
        if(router){
        router.admin_state_up ? this.status = 1 : this.status=0;
        this.project_id = router.project_id;
        }
        this.notifyAll({
            type: this.id,
            data: {status:this.status, fnc:'setStatus'}
        })
    }

    async execute(data, ...middlewares){
        const exec = async i =>{
            middlewares && i < middlewares.length &&
                await middlewares[i](data, async () => await exec(i+1))
        }
        await exec(0)
    }

    async create(user){
        const router = await api.createRouter(this.name, user.token)
        if(router){
            this.openstackId = router.id;
            this.project_id = router.project_id;
            this.name = router.name;
            this.status = 1;
            await this.register();
            this.notifyAll({
                type: this.id,
                data: {status:this.status, fnc:'setStatus'}
            })
        }
    }

    async updatePosition(data){
        await database.updatePosition(data.position, this.id);
        this.notifyAll({
            type: this.id,
            data: {position: data.position, fnc:'setPosition'}
        })
    }

    async savePort(data){
        const port = this.createPort({...data.port, parent: this})
        await database.savePort(port, this.id);
        this.notifyAll({
            type: this.id,
            data: {name:data.port.name, fnc:'addPort'}
        })
    }

    async removePort({id}){
        //criar função pra remover porta com link
        await database.removePort(this.id, id);
        delete this.ports[id];
        this.notifyAll({
            type: this.id,
            data: {id: id, fnc:'removePort'}
        })
    }

    createPort(data){
        const port = new RouterPort(data)
        this.ports[port.id] = port
        const registeredPort = port.register();
        return registeredPort;
    }

    async register(){
        const model = {
            configurations:{
                NOME_DISP: this.name,
                tipo: "Router",
                },
            openstackID: this.openstackId,
            status: 2,
            id: this.id,
            locked: undefined,
            ports: [],
            selected: undefined,
            type: "Router",
            x: this.position.x,
            y: this.position.y,
            }
        await database.addDevice(model, this.project_id);
    }

    async deleteDevice(user){
        this.notifyAll({
            type: this.id,
            data: {status:2, fnc:'setStatus'}
        })
        const functions = [
            api.removeAllRouterInterfaces,
            api.deleteRouter,
        ];
        let data = {
            id: this.id,
            token: user.token,
            router: this
        }
        await this.execute(data, ...functions);
        return data.status;
    }

    
}