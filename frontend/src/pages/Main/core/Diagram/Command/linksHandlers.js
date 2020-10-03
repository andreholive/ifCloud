const linksHandlers = (engine) => {

  const getEngine = () => engine.targetPort.parent.engine;

  return {

    
    portStatusChanged: ({link, status}) => {
      console.log(link)
      link.sourcePort.status = status;
      link.targetPort.status = status;
      link.status = status;
      link.fireEvent(status, 'linkstatus');
      link.fireEvent(link, 'lockNetwork');
    },
    linkstatus: (status) => {
      engine.setSelected(true)
      getEngine().repaintCanvas();
      engine.setSelected(false)
    },
    lockNetwork: (link) => {
      const sw_ports = Object.values(link.targetPort.parent.ports);
      const isLocked = link.targetPort.parent.isLocked();
      link.targetPort.parent.setLocked(!isLocked);
      sw_ports.forEach(port => {
        const links = Object.values(port.links);
        links.forEach(link => {
          const isLocked = link.sourcePort.parent.isLocked();
          link.sourcePort.parent.setLocked(!isLocked);
        })        
      })
    }

  };
};

export default linksHandlers;
