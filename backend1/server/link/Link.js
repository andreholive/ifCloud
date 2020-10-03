const startDatabase = require('../project/database');
const openstackApi = require('../project/openstackApi');

const database = startDatabase();
const api = openstackApi();

module.exports = class Link {
    constructor(data){
        this.id = data.id;
        this.source = data.source
        this.target = data.target
        this.sourcePort = data.sourcePort
        this.targetPort = data.targetPort
        this.notifyAll = data.notifyAll
        this.labels = data.labels
    }

    linker = [];
    project_id = null;
    target = null;
    source = null;

    async execute(data, ...middlewares){
        const exec = async i =>{
            middlewares && i < middlewares.length &&
                await middlewares[i](data, async () => await exec(i+1))
        }
        await exec(0)
    }

    isRouterLink = device => {
        return device.type === 'Router'
    }

    async configGateway(linkdata){
        const functions = [
            api.createSubnet,
            api.createPort,
            api.addRouterInterface
        ];
        let data = {
            network: linkdata.sw.network,
            net_cidr: linkdata.devicePort.net_cidr,
            net_address: linkdata.devicePort.net_address,
            net_dhcp: linkdata.devicePort.net_dhcp,
            token: linkdata.user.token,
            router_id: linkdata.device.openstackId,
            status: false
        }
        await this.execute(data, ...functions);
        return data;
    }

    async configHostLink(linkdata){
        const functions = [
            api.createPort,
            api.osInterface
        ];
        let data = {
            server_id: linkdata.device.openstackId,
            network: linkdata.sw.network,
            subnet: {
                id: linkdata.sw.subnet_id
            },
            token: linkdata.user.token,
            status: false
        }
        await this.execute(data, ...functions);
        return data;
    }

    async create(data){
        if(this.isRouterLink(data.device)){
        const gateway_data = await this.configGateway(data);
        if(gateway_data.status){
            await data.devicePort.saveLink({link:this, openstackId: gateway_data.port.id});
            await data.swPort.saveLink({link:this, openstackId: gateway_data.port.id});
            await data.sw.setSubnet(gateway_data.subnet.id)
        }
        }
        else{
          const hostLink = await this.configHostLink(data);
          if(hostLink.status){
            await data.devicePort.saveLink({link:this, openstackId: hostLink.port.id});
            await data.swPort.saveLink({link:this, openstackId: hostLink.port.id});
          }
        }
        this.project_id = data.user.project;
        await this.register();
        this.target = data.sw;
        this.source = data.device;
        this.notifyAll({
            type: this.target.id,
            data: {port:this.targetPort, fnc:'linkState'}
        })
    }

    async enable(token){
        const targetPort = this.target.ports[this.targetPort];
        const sourcePort = this.source.ports[this.sourcePort];
        const act = await api.enablePort(targetPort.openstackId, token);
        if(act){
            this.status = 1;
            await targetPort.enable();
            await sourcePort.enable();
            await database.updateLink(this.id, ['status'], [1]);
            return true;
        }
        return false;
    }

    async disable(token){
        const targetPort = this.target.ports[this.targetPort];
        const sourcePort = this.source.ports[this.sourcePort];
        const act = await api.disablePort(targetPort.openstackId, token);
        if(act){
            this.status = 0;
            await targetPort.disable();
            await sourcePort.disable();
            await database.updateLink(this.id, ['status'], [0]);
            return true;
        }
        return false;
    }

    async delete(){
        await this.target.ports[this.targetPort].resetLink();
        await this.source.ports[this.sourcePort].resetLink();
        //await this.target.setSubnet(null);
        await database.removeLink(this.id, this.project_id);
        this.notifyAll({
            type: this.target.id,
            data: {port:this.targetPort, fnc:'deleteLink'}
        })
    }

    async initiate(data){
        this.target = data.target;
        this.source = data.source;
        this.target.ports[this.targetPort].setLink(this)
        this.source.ports[this.sourcePort].setLink(this);
        this.project_id = data.user.project;
    }

    linkAct(){
        Object.values(this.linker).forEach(execute => {
            execute()
        })
    }

    async register(){
        const link={
            id: this.id,
            labels: [],
            points: [{
                extras: undefined,
                id: "1",
                locked: undefined,
                selected: undefined,
                type: "point",
                x: 0,
                y: 0,
            },
            {
                extras: undefined,
                id: "2",
                locked: undefined,
                selected: undefined,
                type: "point",
                x: 0,
                y: 0,
            }],
            source: this.source,
            sourcePort: this.sourcePort,
            target: this.target,
            targetPort: this.targetPort,
            network_id: this.network_id,
            cidr: null,
        }
        const labels = Object.values(this.labels)
        await Promise.all(labels.map(async label => {
            link.labels.push({
                extras: undefined,
                id: label.id,
                label: label.name,
                locked: undefined,
                offsetX: 0,
                offsetY: 0,
                selected: undefined,
                type: "default",
            })
        }))
        await database.createLink(link, this.project_id)
    }
}