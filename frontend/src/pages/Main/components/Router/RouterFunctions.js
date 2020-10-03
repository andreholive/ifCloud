import PortModel from '../../core/Port/PortModel';

const getPort = port => {
    if (port instanceof PortModel) return port;
    return new PortModel({ name: port });
  };

export default class RouterFunctions{
    constructor(model){
        this.model = model;
        this.userId = localStorage.getItem("userId");
    }

    socket = () => this.model.socket;

    routerId = () => this.model.options.id;

    updatePosition(){
      if(!this.model.isLocked())
      {
        const data = {
            action: 'updatePosition',
            device_id: this.routerId(),
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
          device_id: this.routerId(),
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

    setStatus(data){
      data.status == 1 ? this.model.setLocked(false) : this.model.setLocked(true);
      this.model.status=data.status;
      this.model.setSelected();
      this.model.parent.parent.clearSelection();
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
        device_id: this.routerId(),
      }
      try {
        this.socket().emit('project-action', data);
      } catch (error) {
          console.log("ERRO", error);
    }
    }

   serializePort(port){
        let data = {
          id: port.options.id,
          name: port.options.name,
          parentNode: this.model.options.id,
        };
        return data
    }

    addPort(port_data){
        const port = getPort(port_data.name);
        port.options.id = port_data.name;
        this.model.addPort(port);
        this.model.engine.repaintCanvas();
        this.model.engine.notify('nsn', `nsn!`)
    }

    addInterface() {
      const number = this.model.getNumberPorts();
      if(number<2){
      const name = `eth${number}`;
      const dados = {
          action: 'savePort',
          device_id: this.routerId(),
          port: {
            id: name,
            name,
            parentNode: this.routerId(),
          }
        }
        try {
          this.socket().emit('device-action', dados);
        } catch (error) {
           console.log("ERRO", error);
      }
    }
    }

    removePort(data){
        const port = this.getportsById(data.id);
        this.model.removePort(port);
        this.model.engine.repaintCanvas();
        this.model.engine.notify('SUCCESS', `Interface Excluída!`)
    }

    removeInterface(id) {
      const data = {
        action: 'removePort',
        id,
        device_id: this.routerId(),
      }
        try {
            this.socket().emit('device-action', data);
          } catch (error) {
             console.log("ERRO", error);
        }
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

    setPosition(data){
      this.model.setPosition(data.position.x, data.position.y);
      this.model.engine.repaintCanvas();
    }

    setGateway(data){
      const port = this.getportsById(data.port_id);
      if(data.status){
      port.functions.setEnabled();
      }else{
      port.functions.setDisabled();  
      }
    }

    async openListener(){
        this.openSocket();
        const data = {
          device_id: this.routerId(),
          action: 'getStatus'
        }
        this.socket().emit('device-action', data);
    }

    openSocket(){
      this.socket().on(this.routerId(), (data) => {
        console.log('recebido', data)
        this[data.data.fnc](data.data)
      })
    }

    async create(){
      this.model.setLocked(true);
      this.openSocket();
      const dados = {
          action: 'createDevice',
          name: this.model.configurations.hostName,
          id: this.routerId(),
          type: 'Router',
          device: 'Router',
          position: {x:this.model.position.x, y:this.model.position.y}
        }
        try {
          this.socket().emit('project-action', dados);
        } catch (error) {
            console.log(error);
        }
    }

    
}