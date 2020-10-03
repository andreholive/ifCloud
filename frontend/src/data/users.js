import api from '../services/api';


const header = {
    headers: {
      "X-Auth-Token": localStorage.getItem("scopedToken")
    }
  };

export default async function getUsers(){
    try{
    
    const response = await api.get('identity/v3/users/', header);
    return response.data.users;
    }
    catch(erro){
        return []
    }
}

export async function createUser({username, email}){
    const user = {
        user: {
            enabled: true,
            name: username,
            password: "user123456",
            email: email,
            options: {
                ignore_password_expiry: true
            }
        }
    }
    try{
    const response = await api.post('identity/v3/users/', user, header);
    return response.data.user;
    }
    catch(erro){
        return []
    }
    
}

export async function getUserProjects(userId){
    const scopedToken = localStorage.getItem("scopedToken");
    const unScopedToken = localStorage.getItem("unScopedToken");
    let token;
    scopedToken ? token = scopedToken : token = unScopedToken;
    const header = {
        headers: {
          "X-Auth-Token": token
        }
      };
    try{
    const response = await api.get(`identity/v3/users/${userId}/projects`, header);
    return response.data.projects;
    }
    catch(erro){
        return []
    }
}

export async function updateUser(values, userId){
    const user = {
        user: {
            name: values.username,
            email: values.email,
        }
    }
    try{
        const response = await api.patch(`identity/v3/users/${userId}`, user, header);
        if(response.status==200){
            return true;
        }
        else{
            return false;
        }
        }
        catch(erro){
            return false;
        }
}

export async function createUserProject(projectName, userId, roleId){
    if(!projectName || !userId || !roleId)return false;
    const project = {
        project: {
            name: projectName,
        }
    }
    try{
        const response = await api.post(`identity/v3/projects`, project, header);
        if(response.status === 201){
            const projectId = response.data.project.id;
            const adminId = localStorage.getItem("userId")
            const r1 = await api.put(`identity/v3/projects/${projectId}/users/${userId}/roles/${roleId}`, "", header);
            const r2 = await api.put(`identity/v3/projects/${projectId}/users/${adminId}/roles/${roleId}`, "", header);
            return response.data.project;
        }
        else{
            return false;
        }
        }
        catch(erro){
            return false;
        }
}

export async function AssignRoleToUserOnProject(user_id, role_id, project_id){
    try{
        const response = await api.put(`identity/v3/projects/${project_id}/users/${user_id}/roles/${role_id}`, "", header);
        if(response.status==204){
            return true;
        }
        else{
            return false;
        }
        }
        catch(erro){
            return false;
        }
}

export async function getRoles(){
    try{
        const response = await api.get(`/identity/v3/roles`, header);
        if(response.status==200){
            return response.data.roles;
        }
        else{
            return false;
        }
        }
        catch(erro){
            return false;
        }
}

export async function changeProject(projectId) {
    const auth = {
      auth: {
        identity: {
          methods: ["token"],
          token: {
            id: localStorage.getItem("unScopedToken")
          }
        },
        scope: {
          project: {
            id: projectId
          }
        }
      }
    };
  
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    try{
    const response = await api.post('identity/v3/auth/tokens', auth, config)
    localStorage.setItem("projectID", response.data.token.project.id);
    localStorage.setItem("scopedToken", response.headers["x-subject-token"]);
    return response.data.token.project.id;
    }catch(err) {
        return false;
      };
  };

  export async function deletetProject(project_id){
    try{
        const response = await api.delete(`identity/v3/projects/${project_id}`, header);
        if(response.status == 204){
           return project_id;
        }
        else{
            return false;
        }
        }
        catch(erro){
            return false;
        }
  }