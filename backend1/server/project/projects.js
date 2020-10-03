const Project = require('./project.js');

module.exports = function createProject(){

    const state = {
        projects: {}
    }

    async function startProject(socket){

        const user = {
            id: socket.handshake.query.user,
            project: socket.handshake.query.project_id,
            token: socket.handshake.query.token,
            emiter: (command) => {socket.emit(command.type, command)}
        }
        if(!state.projects[user.project])
        {
        const project = new Project(user.project);
        state.projects[user.project] = project;
        }

        socket.on('login', async () => {
            await state.projects[user.project].logInUser(user);
        })

        socket.on('device-action', (data) => {
            const device = state.projects[user.project].devices[data.device_id];
            if(device[data.action])device[data.action]({...data, user});
        })

        socket.on('project-action', (data) => {
            const project = state.projects[user.project];
            if(project[data.action])project[data.action]({...data, user});
        })

        socket.on('port-action', (data) => {
            const port = state.projects[user.project].devices[data.device_id].ports[data.id]
            if(port[data.action])port[data.action]({...data, user});
        })

        socket.on('link-move', (data) => {
            state.projects[user.project].notifyMove(data)
        })

        socket.on('link-create', (data) => {
            state.projects[user.project].notifyLinkCreate(data)
        })

        socket.on('link-remove', (data) => {
            state.projects[user.project].notifyLinkRemove(data)
        })

        socket.on('link-connect', (data) => {
            state.projects[user.project].notifyLinConnect(data)
        })

        socket.on('move-device', (data) => {
            state.projects[user.project].notifyMoveDevice(data)
        })

        socket.on('disconnect', () => {
            if(state.projects[user.project]){
            state.projects[user.project].removeUser(user.id);
            const num_users = Object.keys(state.projects[user.project].users).length;
            if(num_users==0){
                delete state.projects[user.project]
            }
        }
            
        })
    }


    return {
        startProject,
    }
}