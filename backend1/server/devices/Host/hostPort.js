const startDatabase = require('../../project/database');
const openstackApi = require('../../project/openstackApi');

const database = startDatabase();
const api = openstackApi();

module.exports = class HostPort {
    constructor(data){
        this.id = data.id;
        this.parentNode = data.parent
        this.link = null;
        data.status? this.status = data.status : this.status = 3;
        this.openstackId = data.openstackId;
        this.name = data.name;
    }

    openstackId = null;
    deleting = false;

    setOpenstackId(id){
        this.openstackId = id;
    }

    setStatus(status){
        this.status=status;
    }

    setLink(link){
        this.link = link;
    }

    async saveChanges(itens, data){
        await database.updatePort(this.parentNode.id, this.id, itens, data);
    }

    async saveLink(data){
        data.link ? this.setStatus(1) : this.setStatus(3)
        this.setLink(data.link);
        this.setOpenstackId(data.openstackId);
        await this.saveChanges(['links', 'status', 'openstackId'], [data.link.id, this.status, data.openstackId])
    }

    async resetLink(){
        if(!this.deleting)
        {
        this.setStatus(3);
        this.link = null;
        this.setOpenstackId(null);
        await this.saveChanges(['links', 'status', 'openstackId'], [null, 3, null]);
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

    async delete(user){
        this.deleting = true;
        if(this.link){
            const del = await api.deletePort(this.openstackId, user.token);
            if(del){
            await this.link.delete();
            await database.removePort(this.parentNode.id, this.id);
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
            macAddr: null,
            name: this.name,
            parentNode: this.parentNode.id,
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