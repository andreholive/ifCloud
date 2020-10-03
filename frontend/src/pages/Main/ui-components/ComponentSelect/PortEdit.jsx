import React, {useState} from 'react';


const PortEdit = ({
  port,
  updateInterface,
  removeInterface
}) => {
  const initialValues = {
      cidr: port.cidr,
      address: port.address,
      dhcp: port.dhcp,
      start: port.range.start,
      end: port.range.end
  }
  const [network, setNetwork ] = useState(port.cidr);
  const [address, setAddress ] = useState(port.address);
  const [dhcp, setDhcp ] = useState(port.dhcp);
  const [start, setStart ] = useState(port.range.start);
  const [end, setEnd ] = useState(port.range.end);
  function getChanges(){
      let changes = {}
      if(initialValues.cidr!=network)changes.cidr = network;
      if(initialValues.address!=address)changes.address = address;
      if(initialValues.dhcp!=dhcp)changes.dhcp = dhcp;
      if(initialValues.start!=start || initialValues.end!=end)changes.range = {start, end};
      return changes;
  }
  
return (
      <div className="tab">
      <input type="radio" id={port.id} name="rd" className="radio1"/>
      <label className="tab-label" htmlFor={port.id}>{port.name}</label>
      <div className="tab-content">
        <div className="address-area">
            <label htmlFor={`ntw-${port.id}`}>Network</label>
            <input type="text" id={`ntw-${port.id}`} className="tab-input"
                value={network}
                onChange={e => setNetwork(e.target.value)}
                disabled={initialValues.cidr}
            />
        </div>
        <div className="address-area">
            <label htmlFor={`ip-${port.id}`}>Address</label>                        
            <input type="text" id={`ip-${port.id}`} className="tab-input"
                value={address}
                onChange={e => setAddress(e.target.value)}
                disabled={initialValues.address}
            />
        </div>
        <div className="dhcp-area">
            <label>DHCP</label>
            <input 
                type="checkbox" 
                id={`${port.name}dhcp`} 
                className="chk"
                onChange={e => {setDhcp(e.target.checked)}}
                checked={dhcp}
            />
        <label htmlFor={`${port.name}dhcp`} className="chk-label"></label>
        <div className="dhcp-range-tab">
        <label>DHCP Range</label>
        <div>
        <label>start</label><input type="text" 
        id="start"
        className="tab-range"
        value={start}
        onChange={e => setStart(e.target.value)}
         />
        <label>end</label><input type="text" 
        id="end" 
        className="tab-range"
        value={end}
        onChange={e => setEnd(e.target.value)}
        />
        </div>
        </div>
        </div>
        <div>
        <button className="btn-salvaPorta" onClick={() => {updateInterface(getChanges(), port.id)}} >Salvar</button>
        <button className="btn-removerPorta" onClick={() => {removeInterface(port.id)}} >Excluir Porta</button>
        </div>
        </div>         
        </div>
  );
};

export default PortEdit;