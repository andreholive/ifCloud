const startDatabase = require('../../project/database');

const database = startDatabase();

module.exports = class RouterPort {
    constructor(data){
        this.id = data.id;
        this.parentNode = data.parent
        data.cidr ? this.net_cidr = data.cidr : this.net_cidr=null;
        data.dhcp ? this.net_dhcp = data.dhcp : this.net_dhcp=null;
        data.address ? this.net_address = data.address : this.net_address=null;
        this.link = null;
        data.status? this.status = data.status : this.status = 3;
        this.openstackId = data.openstackId;
        this.name = data.name;
    }
    openstackId = null;

    setOpenstackId(id){
        this.openstackId = id;
    }

    setStatus(status){
        this.status=status;
    }

    setLink(link){
        this.link = link
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
        this.setStatus(3);
        this.link = null;
        this.setOpenstackId(null);
        await this.saveChanges(['links', 'status', 'openstackId'], [null, 3, null]);
    }

    async execute(data, ...middlewares){
        const exec = async i =>{
            middlewares && i < middlewares.length &&
                await middlewares[i](data, async () => await exec(i+1))
        }
        await exec(0)
    }

    async enable(){
        this.setStatus(1);
        this.saveChanges(['status'], [1]);
    }

    async disable(){
        this.setStatus(0);
        this.saveChanges(['status'], [0]);
    }

    async updatePort(data){
        const functions = []
        Object.entries(data.updates).map(update => {
            functions.push(this[update[0]])
        })
        
        let dataTo = {
            header:this.header,  
            updates: data.updates,
            port_id:this.id,
            router: this.parentNode,
        }
        await this.execute(dataTo, ...functions);
    }

    async dhcp(data, next){
        data.router.ports[data.port_id].net_dhcp = data.updates.dhcp;
        if(data.router.ports[data.port_id].link)
        {
        const linkData = await database.getLinkData(data.router.ports[data.port_id].link);
        const subNet = {subnet: {enable_dhcp: data.updates.dhcp}}
        const response = await api.put(`/v2.0/subnets/${linkData.subnet}`, subNet, data.header);
        if(response.status==200){
            await database.updatePort(data.router.id, 
                data.port_id, 
                ['dhcp'], 
                [response.data.subnet.enable_dhcp]);
        }
        }else{
        await database.updatePort(data.router.id, 
            data.port_id, 
            ['dhcp'], 
            [data.updates.dhcp]);
        }
        next();
    }

    async cidr(data, next){
        data.router.ports[data.port_id].net_cidr = data.updates.cidr;
        if(!data.router.ports[data.port_id].link)
        {
        await database.updatePort(data.router.id, 
            data.port_id, 
            ['cidr'], 
            [data.updates.cidr]);
        }
        next();
    }

    async address(data, next){
        data.router.ports[data.port_id].net_address = data.updates.address;
        if(!data.router.ports[data.port_id].link)
        {
        await database.updatePort(data.router.id, 
            data.port_id, 
            ['address'], 
            [data.updates.address]);
        }
        await next();
    }

    async range(data, next){
        const {id} = data.router
        if(data.router.ports[data.port_id].link)
        {
        
        const linkData = await database.getLinkData(data.router.ports[data.port_id].link);
        const subNet = {subnet: {allocation_pools:[{start:data.updates.range.start,end:data.updates.range.end}],}}
        const response = await api.put(`/v2.0/subnets/${linkData.subnet}`, subNet, data.header);
        if(response.status==200){
            let range = response.data.subnet.allocation_pools[0]
            await database.updatePort(id, 
                data.port_id, 
                ['range'], 
                [{ start: range.start, end: range.end }]);
        }
        }
        else{
        await database.updatePort(id, 
            data.port_id, 
            ['range'], 
            [{ start: data.updates.range.start, end: data.updates.range.end }]);
        }
        await next();
    }

    register(){
        const port={
            alignment: undefined,
            cidr: this.net_cidr,
            address: this.net_address,
            dhcp: this.net_dhcp,
            subnet_id: null,
            range:{
                start:"",
                end: "",
            },
            id: this.id,
            input: true,
            links: null,
            locked: undefined,
            name: this.name,
            openstackId: null,
            parentNode: this.parentNode.openstackId,
            selected: undefined,
            status: this.status,
            type: "Port",
            value: null,
            x: 0,
            y: 0,
        }
        return port;
    }

}