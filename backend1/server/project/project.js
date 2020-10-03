const startDatabase = require('./database');
const Router = require('../devices/router/Router');
const Swicth = require('../devices/Switch/Switch');
const Host = require('../devices/Host/host')
const Link = require('../link/Link');

const database = startDatabase();

module.exports = class Project{
    constructor(id){
        this.project_id = id;
        this.project = null
    }
    users = {};
    devices = {};
    models = {}
    linkModels = {}
    links = {}

    async logInUser(user){
        if(!this.users[user.id])
        {
        this.project = await database.loadProject(this.project_id);
        if(Object.keys(this.users).length == 0){
        await this.startProject(user)
        }
        await database.connectUser(user.id);
        this.users[user.id] = user;
        this.notifyAll({
            type: this.project_id,
            project: this.project
        })
        }
    }

    async notifyLinkCreate(data){
        this.notifyTo({
            type: 'link-create',
            user: data.user,
            port: data.port,
            device: data.device,
        })
    }

    async notifyMoveDevice(data){
        this.notifyTo({
            data:{
                fnc:'setPosition',
                ...data
            },
            type: data.device_id,
            user: data.user
        })
    }

    async notifyLinConnect(data){
        this.notifyTo({
            type: 'link-connect',
            ...data
        })
    }

    async notifyLinkRemove(data){
        console.log('link-remove')
        this.notifyTo({
            type: 'link-remove',
            user: data.user,
            port: data.port,
            device: data.device,
        })
    }

    async notifyMove(data){
        this.notifyTo({
            type: 'link-move',
            user: data.user,
            position: data.position,
            port: data.port,
            device: data.device,
        })
    }

    async removeUser(user_id){
        delete this.users[user_id];
        console.log('User Disconnected')
    }

    async execute(data, ...middlewares){
        const exec = async i =>{
            middlewares && i < middlewares.length &&
                await middlewares[i](data, async () => await exec(i+1))
        }
        await exec(0)
    }

    async reloadProject(){
        console.log('project reloaded')
        this.project = await database.loadProject(this.project_id);
    }

    async startProject(user){
        this.models = this.project.models;
        this.linkModels = this.project.links;
        this.startDevices(user);
        this.startLinks(user);
    }

    startDevices(user){
        const numModels = this.models.length;
        for(let i=0; i<numModels; i++){
            let device;
            let model = this.models[i]
            let data = {
                id: model.id,
                name: model.configurations.NOME_DISP,
                position: {x:model.x, y:model.y},
                network: model.network,
                ports: model.ports,
                openstackID: model.openstackID,
                subnet_id: model.subnet_id,
                cidr: model.cidr
            }
            if(model.configurations.tipo=='Switch'){
                device = new Swicth({...data, notifyAll: (command) => {this.notifyAll(command)}});
            }
            if(model.configurations.tipo=='Router'){
                device = new Router({...data, notifyAll: (command) => {this.notifyAll(command)}});
            }
            if(model.configurations.tipo == 'Host')
            {
                device = new Host({...data, notifyAll: (command) => {this.notifyAll(command)}});
            }
            this.devices[model.id] = device;
            
        }
    }

    async startLinks(user){
        const numLinks = this.linkModels.length;
        for(let i=0; i<numLinks; i++){
            let link = this.linkModels[i]
            let newlink = new Link({
                id: link.id,
                source: link.source,
                target: link.target,
                sourcePort: link.sourcePort,
                targetPort: link.targetPort,
                notifyAll: (command) => {this.notifyAll(command)}
            })
            let data = {
                target: this.devices[link.target],
                source: this.devices[link.source]
            }
            newlink.initiate({...data, user})
            this.links[link.id] = newlink;
        }
    }

    async createLink(data){
        const target = this.devices[data.target];
        const source = this.devices[data.source];
        const sw = [target, source].find(
            device => device.type === 'Switch',
        );
        const device = [target, source].find(
            device => device.type != 'Switch',
        );
        const swPort = Object.values(sw.ports).find(
            port => port.id === data.targetPort || port.id === data.sourcePort,
        );
        const devicePort = Object.values(device.ports).find(
            port => port.id === data.targetPort || port.id === data.sourcePort,
        );
        const link = await sw.ports[swPort.id].createLink({
            sw, 
            device, 
            swPort, 
            devicePort,
            labels: data.labels,
            linkId: data.linkId,
            user: data.user,
            notifyAll: (command) => {this.notifyAll(command)}
        })
        this.links[link.id] = link
    }

    async deleteLink(data){
        await this.links[data.link_id].delete();
        delete this.links[data.link_id];
    }

    async createDevice(data){
        let device;
        this.notifyAll({
            type: 'deviceAdded',
            id: data.id,
            device_type: data.type,
            position: data.position,
            configurations: {
                NOME_DISP: data.name,
                id: data.id
            },
            ports: data.ports
        })
        if(data.device == 'Switch')
        {
        device = new Swicth({...data, notifyAll: (command) => {this.notifyAll(command)}});
        }
        if(data.device == 'Router')
        {
        device = new Router({...data, notifyAll: (command) => {this.notifyAll(command)}});
        }
        if(data.device == 'Host')
        {
        device = new Host({...data, notifyAll: (command) => {this.notifyAll(command)}});
        }
        await device.create(data.user);
        this.devices[device.id] = device;
    }

    async deleteDevice(data){
        const res = await this.devices[data.device_id].deleteDevice(data.user);
        if(res)
        {
            await database.removeModel(data.device_id, this.project_id);
            delete this.devices[data.device_id];
            this.notifyAll({
                type: data.device_id,
                data: {status:true, fnc:'removeDeviceStatus'}
        })
        }
    }

    notifyTo(command){
        Object.values(this.users).forEach(user => {
            if(user.id != command.user)user.emiter(command)
        })
    }

    notifyAll(command){
        Object.values(this.users).forEach(user => {
            user.emiter(command)
        })
    }


}