export default class Debian10Functions{
    constructor(model){
        this.header = {headers:{"X-Auth-Token": localStorage.getItem("scopedToken")}};
        this.model = model;
        this.userId = localStorage.getItem("userId");
    }

    socket = () => this.model.socket;

    serverId = () => this.model.options.id;

    async terminal(){
      const data = {
        action: 'terminal',
        device_id: this.serverId(),
      }
      try {
        this.socket().emit('device-action', data);
      } catch (error) {
         console.log("ERRO", error);
      } 
    }
    
    async powerOn(){
      this.model.setLocked(true);
      const data = {
        action: 'powerOn',
        device_id: this.serverId(),
      }
      try {
        this.socket().emit('device-action', data);
      } catch (error) {
         console.log("ERRO", error);
      }
    }

    async powerOff(){
      this.model.setLocked(true);
      const data = {
        action: 'powerOff',
        device_id: this.serverId(),
      }
      try {
        this.socket().emit('device-action', data);
      } catch (error) {
         console.log("ERRO", error);
      }
    }

    async reboot(){
      this.model.setLocked(true);
      const data = {
        action: 'reboot',
        device_id: this.serverId(),
      }
      try {
        this.socket().emit('device-action', data);
      } catch (error) {
         console.log("ERRO", error);
      }
    }

    async delete(){
      const ports = Object.values(this.model.ports);
      ports.forEach(port => {
        if(Object.values(port.links).length != 0){
          port.functions.setStatus(2)
        }
      })
      const data = {
          action: 'deleteDevice',
          device_id: this.serverId(),
        }
        try {
          this.socket().emit('project-action', data);
        } catch (error) {
          console.log("ERRO", error);
      }
    }

    removeDeviceStatus(data){
      if(data.status){
      this.model.engine.notify('SUCCESS', `${this.model.configurations.NOME_DISP} Excluído!`)
      this.model.remove();
      this.model.engine.repaintCanvas();
      }
    }
    
    setStatus(data){
      if(data.status !== 2){
        this.model.setLocked(false);
      }
      this.model.status=data.status;
      this.model.setSelected();
      this.model.parent.parent.clearSelection();
      this.model.engine.notify('nsn', `nsn`);
    }

    setPosition(data){
      this.model.setPosition(data.position.x, data.position.y);
      this.model.engine.repaintCanvas();
    }

    updatePosition(){
      if(!this.model.isLocked())
      {
      const data = {
          action: 'updatePosition',
          device_id: this.serverId(),
          position: this.model.position
        }
        try {
          this.socket().emit('device-action', data);
        } catch (error) {
           console.log("ERRO", error);
      }
    }
    }

    move(){
      console.log(this.model.isLocked())
      if(!this.model.isLocked())
      {
      const data = {
          device_id: this.serverId(),
          position: this.model.position,
          user: this.userId
        }
        try {
          this.socket().emit('move-device', data);
        } catch (error) {
           console.log("ERRO", error);
      }
      }
    }

    createStatus(data){
      if(!data.status)this.model.engine.notify('DANGER', `Erro ao iniciar ${this.model.configurations.NOME_DISP}`)
      if(data.status)this.model.engine.notify('INFO', `${this.model.configurations.NOME_DISP} Server criado, iniciando...`)
    }

    removeServer(){
      this.model.remove();
      this.model.engine.repaintCanvas();
      this.model.engine.notify('SUCCESS', `${this.model.configurations.NOME_DISP} Excluído`)
    }

    access(data){
      window.open(data.url);
    }

    async openListener(){
        this.openSocket();
        const data = {
          device_id: this.serverId(),
          action: 'getStatus'
        }
        this.socket().emit('device-action', data);
    }

    openSocket(){
      console.log('CRIADO')
      this.socket().on(this.serverId(), (data) => {
        console.log('recebido', data)
        this[data.data.fnc](data.data)
      })
    }

    serializePorts(){
      const ports = Object.values(this.model.ports);
      let portsSerialized = []
      ports.forEach(port =>{
          let data = {};
          data.id = port.options.id;
          data.macAddr = port.macAddr;
          data.name = port.options.name;
          data.parentNode = this.model.options.id;
          portsSerialized.push(data)
      });
      return portsSerialized
    }
    async create(){
      this.openSocket();
      this.model.status=2;
      this.model.setLocked(true);
      this.model.setSelected();
      const dados = {
          action: 'createDevice',
          id: this.serverId(),
          device: 'Host',
          name: this.model.configurations.NOME_DISP,
          position: {x:this.model.position.x, y:this.model.position.y},
          ports: this.serializePorts(),
          flavorRef: "D10_HOST1",
          imageRef: "1d04fb17-ee67-4a48-85d0-e1bcf149177b",
          type: "Debian10Server",
      }
        try {
          this.socket().emit('project-action', dados);
        } catch (error) {
          console.log("ERRO", error);
      }
  }

}