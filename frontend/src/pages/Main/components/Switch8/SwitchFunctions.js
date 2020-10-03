import PortModel from '../../core/Port/PortModel';

const getPort = port => {
  if (port instanceof PortModel) return port;
  return new PortModel({ name: port });
};

export default class SwitchFunctions {
    constructor(model){
        this.model = model;
        this.userId = localStorage.getItem("userId");
    }

    socket = () => this.model.socket;

    switchId = () => this.model.options.id

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
    
    setPosition(data){
        this.model.setPosition(data.position.x, data.position.y);
        this.model.engine.repaintCanvas();
    }

    updatePosition(){
      if(!this.model.isLocked())
      {
      const data = {
          action: 'updatePosition',
          device_id: this.switchId(),
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
      if(!this.model.isLocked())
      {
      const data = {
          device_id: this.switchId(),
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
    
    distributePorts(){
        for(let i = 0; i<8; i++){
          let port = getPort(`eth${i}`);
          port.options.id = `enp${i}s0`;
          port.generateMacAddr();
          this.model.addPort(port);
        }
    }

    setStatus(data){
      data.status == 1 ? this.model.setLocked(false) : this.model.setLocked(true);
      this.model.status=data.status;
      this.model.setSelected();
      this.model.parent.parent.clearSelection();
    }

   getportsById(id){
        const ports = Object.values(this.model.ports);
        let portModel = null;
        ports.forEach(port => {
            if(port.options.id == id)portModel = port
        })
        return portModel
    }
    

    createStatus(data){
        if(data.status==0){
            this.model.engine.notify('DANGER', `Erro ao iniciar ${this.model.configurations.NOME_DISP}`);
            this.model.remove();
            this.model.engine.repaintCanvas();
        }
        if(data.status==1)this.model.engine.notify('SUCCESS', `${this.model.configurations.NOME_DISP} Iniciado com sucesso!`)
    }

    removeDeviceStatus(data){
        if(data.status){
        this.model.engine.notify('SUCCESS', `${this.model.configurations.NOME_DISP} Excluído!`)
        this.model.remove();
        this.model.engine.repaintCanvas();
        }
    }

    portStatus(data){
        const port = this.getportsById(data.port_id);
        port.functions.setStatus(data.status);
    }
    
    async openListener(){
        this.openSocket();
        const data = {
          device_id: this.switchId(),
          action: 'getStatus'
        }
        this.socket().emit('device-action', data);
    }

    openSocket(){
      this.socket().on(this.switchId(), (data) => {
        console.log('recebido', data)
        this[data.data.fnc](data.data)
      })
    }

    setGatewayLink(data){
        if(data.status){
        const port = this.getportsById(data.port)
        port.functions.setStatus(1)
        }
    }

    async linkState(data){
      const port = this.getportsById(data.port);
      port.functions.setStatus(1);
    }

    async deleteLink(data){
      const port = this.getportsById(data.port);
      port.functions.removeLink();
    }

    async create(){
        this.model.setLocked(true);
        this.openSocket();
        const dados = {
            action: 'createDevice',
            id: this.switchId(),
            type: 'Switch',
            device: 'Switch',
            name: this.model.configurations.NOME_DISP,
            position: {x:this.model.position.x, y:this.model.position.y},
            ports: this.serializePorts()
        }
          try {
            this.socket().emit('project-action', dados);
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
          device_id: this.switchId(),
        }
        try {
          this.socket().emit('project-action', data);
        } catch (error) {
           console.log("ERRO", error);
      }
    }

}