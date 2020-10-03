const startDatabase = require('../../project/database');
const openstackApi = require('../../project/openstackApi');

const HostPort = require('./hostPort');

const database = startDatabase();
const api = openstackApi();

module.exports = class Host{
    constructor(data){
        this.id = data.id;
        this.position = data.position;
        this.name = data.name;
        this.openstackId = data.openstackID;
        this.notifyAll = data.notifyAll;
        this.type = 'Host';
        this.soType = data.type;
        this.imageRef = data.imageRef;
        this.flavorRef = data.flavorRef;
        this.status = 0;
        this.startPorts(data.ports)
    }

    ports = {};
    dataPorts = [];
    project_id;
    vm_state = null;
    task_state = null;
    timer = null;

    startPorts(ports){
        if(ports){
        Object.values(ports).forEach(port => {
            this.createPort({...port, parent: this})
        })
        }
    }

    createPort(data){
        const port = new HostPort(data)
        this.ports[port.id] = port
        this.dataPorts.push(port.register());
    }

    async create(user){
        const server = await api.createServer(
            {
            name:this.name, 
            imageRef:this.imageRef, 
            flavorRef: this.flavorRef,
            id: this.id
            }, user.token)
        if(server){
            this.openstackId = server.id;
            this.timer = setInterval(() => {this.checkCreateStatus(user.token)}, 2000)
            this.project_id = user.project;
            await this.register();
        }
    }

    async terminal(data){
        const {token} = data.user;
        const url = await api.hostTerminal(this.openstackId, token);
        console.log(url)
        if(url){
            this.notifyAll({
                type: this.id,
                data: {url, fnc:'access'}
            })
        }
    }

    async powerOff(data){
        this.status = 2;
        this.notifyAll({
            type: this.id,
            data: {status:2, fnc:'setStatus'}
        })
        const {token} = data.user;
        const act = api.hostPowerOff(this.openstackId, token);
        if(act){
            this.timer = setInterval(async () => {
                const status = await this.checkStatus(token);
                const {vm_state, task_state} = status;
                if(vm_state != this.vm_state || task_state != this.task_state){
                    this.vm_state = vm_state;
                    this.task_state = task_state;
                    if(this.vm_state === 'stopped'){
                        clearInterval(this.timer);
                        this.status = 0;
                        this.notifyAll({
                            type: this.id,
                            data: {status:this.status, fnc:'setStatus'}
                        })
                    }
                }
            }, 2000)
        }
    }

    async powerOn(data){
        this.status = 2;
        this.notifyAll({
            type: this.id,
            data: {status:2, fnc:'setStatus'}
        })
        const {token} = data.user;
        const act = api.hostPowerOn(this.openstackId, token);
        if(act){
            this.timer = setInterval(async () => {
                const status = await this.checkStatus(token);
                const {vm_state, task_state} = status;
                if(vm_state != this.vm_state || task_state != this.task_state){
                    this.vm_state = vm_state;
                    this.task_state = task_state;
                    if(this.vm_state === 'active'){
                        clearInterval(this.timer);
                        this.status = 1;
                        this.notifyAll({
                            type: this.id,
                            data: {status:this.status, fnc:'setStatus'}
                        })
                    }
                }
            }, 2000);
        }
    }

    async reboot(data){
        this.status = 2;
        this.notifyAll({
            type: this.id,
            data: {status:2, fnc:'setStatus'}
        })
        const {token} = data.user;
        const act = api.hostReboot(this.openstackId, token);
        if(act){
            this.timer = setInterval(async () => {
                const status = await this.checkStatus(token);
                const {vm_state, task_state} = status;
                console.log(this.task_state, this.vm_state)
                if(vm_state != this.vm_state || task_state != this.task_state){
                    this.vm_state = vm_state;
                    this.task_state = task_state;
                    if(this.vm_state === 'active'){
                        clearInterval(this.timer);
                        this.status = 1;
                        this.notifyAll({
                            type: this.id,
                            data: {status:this.status, fnc:'setStatus'}
                        })
                    }
                }
            }, 2000)
        }
    }

    async checkStatus(token){
        const server = await api.getServer(this.openstackId, token);
        const vm_state = server['OS-EXT-STS:vm_state'];
        const task_state = server['OS-EXT-STS:task_state'];
        return {vm_state, task_state};
    }

    async checkCreateStatus(token){
        const server = await api.getServer(this.openstackId, token);
        const vm_state = server['OS-EXT-STS:vm_state'];
        const task_state = server['OS-EXT-STS:task_state'];
        if(vm_state != this.vm_state){
            this.vm_state = vm_state;
            switch(vm_state){
                case 'building':
                    this.status = 2;
                    break;
                case 'active':
                    this.status = 1;
                    break;
                default:
                    this.status = 0;
            }
            if(this.status === 1){
                clearInterval(this.timer)
                const clear = await api.hostClearNetwork(this.openstackId, token);
                if(clear){
                    this.notifyAll({
                        type: this.id,
                        data: {status:this.status, fnc:'setStatus'}
                    })
                }
            }
            
        }
    }

    async deleteDevice(user){
        this.notifyAll({
            type: this.id,
            data: {status:2, fnc:'setStatus'}
        })
        await Promise.all(Object.values(this.ports).map(async port => {
            await port.delete(user);
        }));
        const del = await api.deleteServer(this.openstackId, user.token);
        return del;
    }

    async updatePosition(data){
        await database.updatePosition(data.position, this.id);
        this.notifyAll({
            type: this.id,
            data: {position: data.position, fnc:'setPosition'}
        })
    }

    async getStatus(data){
        console.log('getStatus')
        const server = await api.getServer(this.openstackId, data.user.token);
        server['OS-EXT-STS:vm_state'] == 'active' ? this.status = 1 : this.status = 0;
        const task = server['OS-EXT-STS:task_state']
        this.notifyAll({
            type: this.id,
            data: {status:this.status, task, fnc:'setStatus'}
        })
    }

    async register(){
        const model = {
            configurations:{
                NOME_DISP: this.name,
                tipo: 'Host',
                },
            openstackID: this.openstackId,
            id: this.id,
            locked: undefined,
            ports: this.dataPorts,
            selected: undefined,
            type: this.soType,
            x: this.position.x,
            y: this.position.y,
            }
            await database.addDevice(model, this.project_id);
    }
}