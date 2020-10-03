import React, {useEffect, useState} from 'react';


const PortEdit = ({
  port
}) => {
const [address, setAddress] = useState(port.address);
const [cidr, setCidr] = useState(port.cidr);
const [dhcp, setDhcp] = useState(port.dhcp);

useEffect(()=> {

},[]);

return (
      <div className="tab">
      <input type="checkbox" id={port.options.id} name="rd" className="radio1"/>
      <label className="tab-label" htmlFor={port.options.id}>{port.options.name}</label>
      <div className="tab-content">
        <div className="address-area">
            <label htmlFor={`ntw-${port.options.id}`}>Network</label>
            <input type="text" id={`ntw-${port.options.id}`} className="tab-input"
                onChange={e => {setCidr(e.target.value)}}
                disabled={false}
                value={cidr}
                disabled={port.cidr}
                pattern='(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\/([8-9]|1[0-9]|2[0-9]|30)$'
            />
        </div>
        <div className="address-area">
            <label htmlFor={`ip-${port.options.id}`}>Address</label>                        
            <input type="text" id={`ip-${port.options.id}`} className="tab-input"
                onChange={e => {setAddress(e.target.value)}}
                disabled={false}
                value={address}
                disabled={port.address}
                pattern='(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])$'
            />
        </div>
        <div className="dhcp-area">
            <label>DHCP</label>
            <input 
                type="checkbox" 
                id={`${port.options.name}dhcp`} 
                className="chk"
                onChange={() => {setDhcp(!dhcp)}}
                checked={dhcp}
            />
        <label htmlFor={`${port.options.name}dhcp`} className="chk-label"></label>
        <div className="dhcp-range-tab">
        <label>DHCP Range</label>
        <div>
        <label>start</label><input type="text" 
        id="start"
        className="tab-range"
        onChange={() => {}}
         />
        <label>end</label><input type="text" 
        id="end" 
        className="tab-range"
        onChange={() => {}}
        />
        </div>
        </div>
        </div>
        <div>
        <button className="btn-salvaPorta" onClick={() => {}} >Salvar</button>
        <button className="btn-removerPorta" onClick={() => {}} >Excluir Porta</button>
        </div>
        </div>         
        </div>
  );
};

export default PortEdit;