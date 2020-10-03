const startDatabase = require('../../project/database');
const openstackApi = require('../../project/openstackApi');
const SwitchPort = require('./SwitchPort');

const database = startDatabase();
const api = openstackApi();

module.exports = class Switch{
    constructor(data){
        this.name = data.name;
        this.id = data.id;
        this.network = data.network;
        this.subnet_id = data.subnet_id;
        this.cidr = data.cidr;
        this.position = data.position;
        this.notifyAll = data.notifyAll;
        this.startPorts(data.ports);
        this.type = 'Switch'
    }
    status = 2;
    ports = {};
    dataPorts = []
    project_id;

    async execute(data, ...middlewares){
        const exec = async i =>{
            middlewares && i < middlewares.length &&
                await middlewares[i](data, async () => await exec(i+1))
        }
        await exec(0)
    }

    startPorts(ports){
        if(ports){
        Object.values(ports).forEach(port => {
            this.createPort(port)
        })
        }
    }

    async setSubnet(id){
        this.subnet_id = id;
        await database.updateDevice(this.id, ['subnet_id'], [id]);
    }

    createPort(data){
        const port = new SwitchPort(data)
        this.ports[port.id] = port
        const registeredPort = port.register();
        return registeredPort;
    }

    generatePorts(){
        Object.values(this.ports).forEach(port => {
        const newPort = new SwitchPort({...port, network_id: this.network})
        this.ports[port.id] = newPort
        this.dataPorts.push(port.register());
        })
    }

    async getStatus(data){
        const network = await api.getNetwork(this.network, data.user.token);
        if(network){
            network.admin_state_up ? this.status = 1 : this.status = 0;
            this.project_id = network.project_id;
        }
        this.notifyAll({
            type: this.id,
            data: {status:this.status, fnc:'setStatus'}
        })
    }

    async create(user){
        const network = await api.createNetwork(this.name, user.token);
        if(network){
            this.network=network.id;
            this.project_id = network.project_id;
            this.status=1;
            this.generatePorts()
            await this.register();
            this.notifyAll({
                type: this.id,
                data: {status:this.status, fnc:'setStatus'}
            })
        }else{
        //enviar erro
        }          
    }

    async deleteDevice(user){
        this.notifyAll({
            type: this.id,
            data: {status:2, fnc:'setStatus'}
        })
        const promises = Object.values(this.ports).map(async port => {
            await port.delete(user);
        });
        await Promise.all(promises);
        const del = await api.deleteNetwork(this.network, user.token)
        if(del){
            return true
        }else{
            return false
        }
    }

    async updatePosition(data){
        await database.updatePosition(data.position, this.id);
        this.notifyAll({
            type: this.id,
            data: {position: data.position, fnc:'setPosition'}
        })
    }

    async createSubnet(data, next){
        const {database} = data.router.user
        let subNet={subnet:{
            network_id: data.network_id,
            ip_version: 4,
            cidr: data.cidr
            }
        }
        if(data.address)subNet.subnet.gateway_ip = data.address;
        if(!data.dhcp)subNet.subnet.enable_dhcp = false;
        if(data.range.start!='' && data.range.end!='')subNet.subnet.allocation_pools=[{start:data.range.start,end:data.range.end}]
        try {
            const response = await api.post('/v2.0/subnets', subNet, data.header)
            if(response.status === 201){
                const {allocation_pools, id, gateway_ip} = response.data.subnet
                data.subnet_id = id;
                data.gateway_ip = gateway_ip;
                await database.updatePort(data.router.id, 
                    data.sourcePort,
                    ['range'], 
                    [{ start: allocation_pools[0].start, end: allocation_pools[0].end }]);
                await next();
            }
        } catch (error) {
            console.log("erro subnet")
            return false;
        }
    }

    async enablePort(data){
        this.notifyAll({
            type: this.id,
            data: {port_id:data.id, status:2, fnc:'portStatus'}
        })
        const port = this.ports[data.id];
        if(port.link){
            const act = await port.link.enable(data.user.token);
            if(act){
                this.notifyAll({
                    type: this.id,
                    data: {port_id:data.id, status:1, fnc:'portStatus'}
                })
            }
        }
    }

    async disconnectLink(data){
        this.notifyAll({
            type: this.id,
            data: {port_id:data.id, status:2, fnc:'portStatus'}
        });
        const port = this.ports[data.id];
        const act = await port.disconnectLink(data.user.token);
    }

    async disablePort(data){
        this.notifyAll({
            type: this.id,
            data: {port_id:data.id, status:2, fnc:'portStatus'}
        })
        const port = this.ports[data.id];
        if(port.link){
            const act = await port.link.disable(data.user.token);
            if(act){
                this.notifyAll({
                    type: this.id,
                    data: {port_id:data.id, status:0, fnc:'portStatus'}
                })
            }
        }
    }

    async register(){
        const model = {
            configurations:{
                NOME_DISP: this.name,
                tipo: "Switch",
                },
            id: this.id,
            status: this.status,
            network: this.network,
            subnet_id: null,
            cidr: null,
            locked: undefined,
            ports: this.dataPorts,
            selected: undefined,
            type: "Switch",
            x: this.position.x,
            y: this.position.y,
            }
        await database.addDevice(model, this.project_id);
    }

}