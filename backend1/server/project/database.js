const User = require('../models/user');
const Project = require('../models/project');
const Model = require('../models/models');
const Link = require('../models/link');

module.exports = function startDatabase(){

    async function getUser(uid){
        const user = await User.findOne({uid:uid});
        return user;
    }

    async function getProject(id){
        const project = await Project.findOne({projectId:id});
        return project;
    }

    async function getModel(id){
        const model = await Model.findOne({id:id});
        return model;
    }

    async function getLink(id){
        const link = await Link.findOne({id:id});
        return link;
    }

    function findPort(id, model){
        function portModel(port) { 
            return port.id === id;
        }
        const port = model.ports.find(portModel);
        const index = model.ports.indexOf(port);
        return {port, index};
    }

    async function loadProject(id){
        const project = await Project.findOne({projectId:id}).populate(['models', 'links']);
        if(project)return project;
        try{
            const project = await Project.create({projectId: id});
            console.log("Project CREATED")
            return project;
        }catch (err){
            console.log(err);
        }
    }

    async function connectUser(uid){
        const user = await getUser(uid);
        if(user){
            return user;
        };
        try{
            const user = await User.create({uid});
            console.log("User CREATED")
            return user
        }catch (err){
            console.log(err);
        }
    }

    async function updatePosition(position, id){
        const model = await Model.findOne({id:id});
        model.x = position.x;
        model.y = position.y;
        await model.save();
    }

    async function addDevice(model, project_id){
        const project = await getProject(project_id);
        const device = await Model.create(model);
        project.models.push(device);
        await project.save();
    }

    async function updateDevice(id, item, data){
        const model = await Model.findOne({id:id});
        for(let i=0; i<item.length; i++){
            model[item[i]] = data[i];
        }
        await model.save();
    }

    async function removeModel(id, project_id){
        const project = await getProject(project_id)
        const model = await getModel(id);
        await Model.remove({id:id});
        project.models.pull(model);
        await project.save();
    }

    async function savePort(data, id){
        const model = await Model.findOne({id:id});
        model.ports.push(data);
        await model.save();
    }

    async function removePort(device_id, port_id){
        const device = await Model.findOne({id:device_id});
        const {index} = findPort(port_id, device);
        device.ports.splice(index, 1);
        await device.save();
    }

    async function updatePort(device_id, port_id, item, data){
        
        const device = await Model.findOne({id:device_id});
        const {port, index} = findPort(port_id, device);
        
        for(let i=0; i<item.length; i++){
        port[item[i]] = data[i];
        }
        device.ports.set(index, port);
        await device.save();
    }

    async function getLinkData(id){
        const link = await getLink(id);
        const device = await Model.findOne({id:link.target});
        const subnet = device.subnet_id;
        return {link, subnet};
    }

    async function createLink(link, project_id){
        const project = await getProject(project_id);
        const newLink = await Link.create(link);
        project.links.push(newLink);
        await project.save();
    }

    async function removeLink(id, project_id){
        const project = await getProject(project_id)
        const link = await getLink(id);
        await Link.remove({id:id});
        project.links.pull(link);
        await project.save();
    }

    async function updateLink(id, item, data){
        const link = await getLink(id);
        for(let i=0; i<item.length; i++){
        link[item[i]] = data[i];
        }
        await link.save();
    }

    return{
        connectUser,
        loadProject,
        updatePosition,
        addDevice,
        removeModel,
        savePort,
        removePort,
        updatePort,
        getLinkData,
        createLink,
        removeLink,
        updateDevice,
        updateLink
    }

}