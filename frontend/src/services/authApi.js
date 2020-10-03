import api from './api'

const AUTH_BASE_URL = "/identity";
const USER_TOKEN_URL = "/v3/auth/tokens";

export default async (data) => {
    let res = { user_id: null, error: false, msg: "", projects:[], token:null};
    const auth = {
        auth: {
          identity: {
            methods: ["password"],
            password: {
              user: {
                name: data.id,
                domain: {
                  name: "Default"
                },
                password: data.pass
              }
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
        const response = await api.post('/identity/v3/auth/tokens', auth, config)
        res.user_id = response.data.token.user.id;
        let unScopedToken = response.headers["x-subject-token"];
        console.log(unScopedToken)
        localStorage.setItem("unScopedToken", unScopedToken);
        const res2= await getOwnProjects(res, unScopedToken);
        return res2;
      }
      catch(error) {
        res.error = true;
        if (
          error.request.status === 404 ||
          error.request.status === 401 ||
          error.request.status === 422
        ) {
          res.msg = "Email or password is wrong";
        }        
      };
} 
const getOwnProjects = async (data, token) => {
    const header = {
      headers: {
        "X-Auth-Token": token
      }
    };
    try{
    const response = await api.get(`identity/v3/users/${data.user_id}/projects`, header)
    data.projects=response.data.projects
    //const res = await fetchScopedToken(apiResponse, token);
    return data;
    }catch(error){
        data.error = true;
        if (
          error.request.status === 404 ||
          error.request.status === 401 ||
          error.request.status === 422
        ) {
          data.msg = "UserId or Unscopped token is wrong";
        }
        console.log("ERRO ",data)
      };
  };

  const fetchScopedToken = async (apiResponse, unScopedToken) => {
    const auth = {
      auth: {
        identity: {
          methods: ["token"],
          token: {
            id: unScopedToken
          }
        },
        scope: {
          project: {
            id: apiResponse.response.data.projects[0].id
          }
        }
      }
    };
  
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    const url = AUTH_BASE_URL + USER_TOKEN_URL;
    try{
    const response = await api.post(url, auth, config)
    localStorage.setItem("projectID", response.data.token.project.id);
    localStorage.setItem("userId", response.data.token.user.id);
    localStorage.setItem("scopedToken", response.headers["x-subject-token"]);
    apiResponse.response = response;
    return apiResponse;
    }catch(err) {
        console.log(err);
      };
  };