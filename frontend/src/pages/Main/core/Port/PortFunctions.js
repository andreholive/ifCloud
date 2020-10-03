
export default class PortFunctions {
    constructor(port){
        this.header = {headers: {"X-Auth-Token": localStorage.getItem("scopedToken")}};
        this.port = port;
    }

    portId = () => this.port.options.id

    parentId = () => this.port.parent.options.id;

    socket = () => this.port.parent.socket;

    link = () => this.port.getMainLink();

    linkId = () => this.link().options.id;

    engine = () => this.port.parent.engine;

    getTargetId = () => this.link().targetPort.parent.options.id;

    getPortTarget = () => this.link().targetPort.options.id;
        
    updatePort(updates) {
        this.port.cidr = updates.cidr;
        this.port.address = updates.address;
        this.port.dhcp = updates.dhcp;
        const dados = {
            action: 'updatePort',
            device_id: this.parentId(),
            id: this.portId(),
            updates
          }
          try {
            this.socket().emit('port-action', dados);
          } catch (error) {
             console.log("ERRO", error);
        }
      }

    async enable(){
        const dados = {
            action: 'enablePort',
            device_id: this.getTargetId(),
            id: this.getPortTarget(),
          }
          try {
            this.socket().emit('device-action', dados);
          } catch (error) {
             console.log("ERRO", error);
        }
    }
    
    async disable(){
        const dados = {
            action: 'disablePort',
            device_id: this.getTargetId(),
            id: this.getPortTarget(),
          }
          try {
            this.socket().emit('device-action', dados);
          } catch (error) {
             console.log("ERRO", error);
        }
    }

    async getLabelsName(link){
        let labels = {};
        await Promise.all(link.labels.map(async label => {
            labels[label.options.id] = {
                id: label.options.id,
                name: label.options.label
            };
        }))
        return labels;
    }

    async createLink(link){
        this.build();
        console.log(link)
        const data = {
          source: link.sourcePort.parent.options.id,
          target: link.targetPort.parent.options.id,
          sourcePort: link.sourcePort.options.id,
          targetPort: link.targetPort.options.id,
          linkId: link.options.id,
          action: 'createLink',
          labels: await this.getLabelsName(link)
        }
        this.socket().emit('project-action', data);
    }

    async disconnectLink(){
        const dados = {
            action: 'disconnectLink',
            device_id: this.getTargetId(),
            id: this.getPortTarget(),
          }
          try {
            this.socket().emit('device-action', dados);
          } catch (error) {
             console.log("ERRO", error);
        }
    }

    removeLink(){
        this.port.fireEvent({link:this.link(), status:3}, 'portStatusChanged');
        this.link().remove();
        this.repaint();
    }

    setStatus(status){
        this.port.fireEvent({link:this.link(), status}, 'portStatusChanged');
        if(status==1)this.engine().notify('SUCCESS', `Porta ${this.port.options.name} Ativada!`)
        if(status==0)this.engine().notify('SUCCESS', `Porta ${this.port.options.name} Desativada!`)
        this.repaint();
    }
    
    build(){
        this.port.fireEvent({link:this.link(), status:2}, 'portStatusChanged');
        this.repaint();
    }

    repaint = () => this.engine().repaintCanvas();

}