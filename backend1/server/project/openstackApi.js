const axios = require('axios');
require('dotenv').config();

const computeApi = axios.create({baseURL: process.env.COMPUTE_URL});

const networkApi = axios.create({baseURL: process.env.NETWORK_URL});


module.exports = function openstackApi(){

    function getHeader(token){
        return {headers:{"X-Auth-Token": token}}
    }

    async function createRouter(name, token){
        try 
        {
        const router = {router:{
            name,
            external_gateway_info: {
                enable_snat: true,
                network_id: "98f5a4a1-6731-4d56-815c-4082c56c7358"
            }
        }}
        const response = await networkApi.post('/v2.0/routers', router, getHeader(token))
        if(response.status == 201){
            return response.data.router
        }
        }catch (error) 
        {
            console.log(error)
           return false //tratar erro 
        }
    }

    async function getRouter(id, token) {
        try {
        const response = await networkApi.get(`/v2.0/routers/${id}`, getHeader(token));
            if(response.status==200){
                return response.data.router
            }
            else{
                return false;
            }
        }
        catch(error){
            return false;
        }
    }

    async function addRouterInterface(data, next) //middleware
    {
        const portRouter = {port_id: data.port.id};
        const response = await networkApi.put(`/v2.0/routers/${data.router_id}/add_router_interface`, portRouter, getHeader(data.token));
        if(response.status==200)
        {
            data.status=true
            await next();
        }else{
            data.status=false
        }
    }

    async function removeRouterInterface(id, router_id, token){
        try{
            const dados = {port_id: id}
            const response = await networkApi.put(`/v2.0/routers/${router_id}/remove_router_interface`, dados, getHeader(token));
            if(response.status == 200){
                return true;
            }
            return false;
        }catch(error){
            console.log(error)
            return false;
        }
    }

    async function removeAllRouterInterfaces(data, next) //middleware
    {
        try {
            const promises = Object.values(data.router.ports).map(async port => {
                if(port.openstackId){
                let dados = {port_id: port.openstackId}
                const response = await networkApi.put(`/v2.0/routers/${data.router.openstackId}/remove_router_interface`, dados, getHeader(data.token));
                if(response.status == 200){
                    await port.link.delete();
                }
            }
            })
            await Promise.all(promises);
            await next();
            } catch (error) {
                data.status = false;
                console.log(error)
            }
    }

    async function deleteRouter(data, next) //middleware
    {
        try {
            const response = await networkApi.delete(`/v2.0/routers/${data.router.openstackId}`, getHeader(data.token))
            if(response.status == 204){
                data.status = true;
                next();
            }
            else{
                data.status = false;
            }
        } catch (error) {
            console.log(error)
            data.status = false;
        }
    }

    async function createNetwork(name, token){
        const network = {network: {name, mtu: 1400}}
        try {
            const response = await networkApi.post('/v2.0/networks', network, getHeader(token))
            if(response.status == 201){
                return response.data.network;
            }else{
                return false;
            //enviar erro
            }          
        } catch (error) {
            console.log(error)
            return false;
            //tratar erro
        }
    }

    async function deleteNetwork(id, token){
        try {
            const response = await networkApi.delete(`/v2.0/networks/${id}`, getHeader(token));
            if(response.status==204){
                return true;
            }else{
                return false;
            }
        } catch (error) {
            return false;
        }
    }

    async function getNetwork(id, token){
        try {
            const response = await networkApi.get(`/v2.0/networks/${id}`, getHeader(token))
            if(response.status == 200){
                return response.data.network
            }
            else{
                return false
            }
        }catch(error){
            console.log(error)
            return false
        }
    }

    async function createPort(data, next) //middleware
    {
        const port = {
            port: {
                admin_state_up: true,
                fixed_ips:[{}],
                network_id: data.network
            }
        }
        data.subnet ? port.port.fixed_ips[0].subnet_id = data.subnet.id : null;
        data.net_address ? port.port.fixed_ips[0].ip_address = data.net_address : null;
        try {
        const response = await networkApi.post(`/v2.0/ports/`, port, getHeader(data.token))
        if(response.status==201)
        {
            data.port = response.data.port
            await next();
        }
        return false;
    } catch (error) {
        return false;
    }
    }

    async function enablePort(id, token){
        try{
            const data = {"port": {"admin_state_up": true}}
            const response = await networkApi.put(`/v2.0/ports/${id}`, data, getHeader(token));
            if(response.status==200){
                return true;
            }
            return false;
        }catch(error){
            return false;
        }
    }

    async function disablePort(id, token){
        try{
            const data = {"port": {"admin_state_up": false}}
            const response = await networkApi.put(`/v2.0/ports/${id}`, data, getHeader(token));
            if(response.status==200){
                return true;
            }
            return false;
        }catch(error){
            return false;
        }
    }

    async function deletePort(id, token){
        try{
            const response = await networkApi.delete(`/v2.0/ports/${id}`, getHeader(token));
            if(response.status == 204)
            {
                return true;
            }
            return false
        }catch(error){
            console.log(error)
            return false;
        }
    }

    async function createSubnet(data, next) //middleware
    {
        let subNet={subnet:{
            network_id: data.network,
            ip_version: 4,
            cidr: data.net_cidr,
            dns_nameservers: ['8.8.8.8','8.8.4.4']
            }
        }
        if(data.net_address)subNet.subnet.gateway_ip = data.net_address;
        if(!data.net_dhcp)subNet.subnet.enable_dhcp = false;
        //if(data.range.start!='' && data.range.end!='')subNet.subnet.allocation_pools=[{start:data.range.start,end:data.range.end}]
        try {
            const response = await networkApi.post('/v2.0/subnets', subNet, getHeader(data.token))
            if(response.status === 201){
                data.subnet = response.data.subnet;
                await next();
            }
        } catch (error) {
            return false;
        }
    }

    async function removeSubnet(data, next) //middleware
    {
        try {
            const response = await networkApi.delete(`/v2.0/subnets/${data.subnet_id}`, getHeader(data.token))
            if(response.status == 204){
                await next();
            }
        } catch (error) {
            return false;
        }
    }

    async function createServer(data, token){
        const header = {
            headers:{  
                "X-Auth-Token": token,
                "OpenStack-API-Version": "compute 2.37"
            }
        };
        const newServer = {
            server: {
            name: data.name,
            imageRef: data.imageRef,
            flavorRef: data.flavorRef,
            availability_zone: "nova",
            networks : [{
                uuid : "f8596d6c-0caf-422c-bf62-b11c8e75a2aa"
            }],
            security_groups: [{name: "default"}],
            metadata:{model_id : data.id},
            }
        }
        try {
            const response = await computeApi.post('/compute/v2.1/servers', newServer, header);
            if(response.status == 202)
            {
                return response.data.server;
            }
            return false;
        } catch (error) {
            return false;
        }
        
    }

    async function getServer(id, token){
        try {
            const response = await computeApi.get(`/compute/v2.1/servers/${id}`, getHeader(token))
            if(response.status == 200)
            {
               return response.data.server
            }
            
        } catch (error) {
            return false;
        }
    }

    async function deleteServer(id, token){
        try {
        const response = await computeApi.delete(`/compute/v2.1/servers/${id}`, getHeader(token));
        if(response.status = 204)
        {
           return true 
        }
        return false;
        }catch(error){
            return false;
        }
    }

    async function osInterface(data, next){
        try{
        const set = {interfaceAttachment:{port_id: data.port.id}}
        const response = await computeApi.post(`/compute/v2.1/servers/${data.server_id}/os-interface`, set, getHeader(data.token));
        if(response.status==200){
            data.status = true;
            await next();
        }
        }catch(error){
            console.log(error.response.data)
            return false;
        }
    }

    async function hostClearNetwork(server_id, token){
        try{
        const response = await computeApi.get(`/compute/v2.1/servers/${server_id}/os-interface`, getHeader(token));
        const interfaces = response.data.interfaceAttachments
        const promises = interfaces.map(async interface => {
            console.log('deleted', interface.port_id)
            await computeApi.delete(`/compute/v2.1/servers/${server_id}/os-interface/${interface.port_id}`, getHeader(token));
        });
        await Promise.all(promises);
        return true;
        }
        catch(error){
            console.log(error)
            return false;
        }
    }

    async function hostTerminal(server_id, token){
        console.log(server_id, token)
        try{
        const data = {"os-getVNCConsole":{"type":"novnc"}};
        const response = await computeApi.post(`/compute/v2.1/servers/${server_id}/action`, data, getHeader(token));
        return response.data.console.url;
        }
        catch(error){
            return false;
        }
    }

    async function hostPowerOn(server_id, token){
        try{
        const data = {"os-start":null}
        const response = await computeApi.post(`/compute/v2.1/servers/${server_id}/action`, data, getHeader(token));
        if(response.status == 202){
            return true;
        }
        return false;
        }catch(error){
            return false
        }
    }

    async function hostPowerOff(server_id, token){
        try{
        const data = {"os-stop":null}
        const response = await computeApi.post(`/compute/v2.1/servers/${server_id}/action`, data, getHeader(token));
        if(response.status == 202){
            return true;
        }
        return false;
        }catch(error){
            return false
        }
    }

    async function hostReboot(server_id, token){
        try{
        const data = {"reboot":{"type":"SOFT"}}
        const response = await computeApi.post(`/compute/v2.1/servers/${server_id}/action`, data, getHeader(token));
        if(response.status == 202){
            return true;
        }
        return false;
        }catch(error){
            return false
        }
    }

    return {
        createRouter,
        createNetwork,
        getRouter,
        getNetwork,
        removeAllRouterInterfaces,
        deleteRouter,
        createSubnet,
        addRouterInterface,
        createPort,
        removeSubnet,
        deleteNetwork,
        deletePort,
        removeRouterInterface,
        createServer,
        deleteServer,
        getServer,
        osInterface,
        hostClearNetwork,
        hostTerminal,
        hostPowerOn,
        hostPowerOff,
        hostReboot,
        enablePort,
        disablePort
    }
}