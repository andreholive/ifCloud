const startDatabase = require('../../project/database');
const openstackApi = require('../../project/openstackApi');

const Link = require('../../link/Link');

const database = startDatabase();
const api = openstackApi();

module.exports = class Port {
    constructor(data){
        this.id = data.id;
        this.name = data.name;
        this.parentNode = data.parentNode;
        this.mac_address = data.macAddr;
        this.network_id = data.network_id;
        this.status = data.status;
        this.openstackId = data.openstackId;
    }
    link = null
    openstackId = null;
    deleting = false;

    async createLink(data){
        this.source = data.device.id
        this.target = data.sw.id
        this.sourcePort = data.devicePort.id
        this.targetPort = data.swPort.id
        const link = new Link({
            id: data.linkId,
            source: data.device.id,
            target: data.sw.id,
            sourcePort: data.devicePort.id,
            targetPort: data.swPort.id,
            labels: data.labels,
            notifyAll: data.notifyAll
        })
        await link.create(data)
        return link;
    }

    setStatus(status){
        this.status=status;
    }
    
    setOpenstackId(id){
        this.openstackId = id;
    }

    setLink(link){
        this.link = link;
    }

    routerConnected = () => this.link.isRouterLink(this.link.source);

    async saveChanges(itens, data){
        await database.updatePort(this.parentNode, this.id, itens, data);
    }

    async saveLink(data){
        data.link ? this.setStatus(1) : this.setStatus(3);
        this.setLink(data.link);
        this.setOpenstackId(data.openstackId);
        await this.saveChanges(['links', 'status', 'openstackId'], [data.link.id, this.status, data.openstackId])
    }

    async resetLink(){
        if(!this.deleting){
            this.setStatus(3);
            this.link = null;
            this.setOpenstackId(null);
            await this.saveChanges(['links', 'status', 'openstackId'], [null, 3, null]);
        }   
    }

    async delete(user){
        this.deleting = true;
        if(this.link){
            if(!this.routerConnected()){
                await api.deletePort(this.openstackId, user.token);
            }
            else{
                await api.removeRouterInterface(this.openstackId, this.link.source.openstackId, user.token);
            }
            await this.link.delete();
        }
    }

    async enable(){
        this.setStatus(1);
        this.saveChanges(['status'], [1]);
    }

    async disable(){
        this.setStatus(0);
        this.saveChanges(['status'], [0]);
    }

    async disconnectLink(token){
        if(this.link){
            if(!this.routerConnected()){
                const act = await api.deletePort(this.openstackId, token);
                if(act){
                    await this.link.delete();
                }
            }
            else{
                const act = await api.removeRouterInterface(this.openstackId, this.link.source.openstackId, token);
                if(act){
                    await this.link.delete();
                }
            }
        } 
    }

    register(){
        const port={
            alignment: undefined,
            build: false,
            cidr: null,
            extras: undefined,
            id: this.id,
            input: true,
            links: null,
            locked: undefined,
            macAddr: this.mac_address,
            name: this.name,
            parentNode: this.parentNode,
            openstackId: null,
            selected: undefined,
            status: 3,
            network_id: null,
            type: "Port",
            value: null,
            x: 0,
            y: 0,
        }
        return port;
    }

}