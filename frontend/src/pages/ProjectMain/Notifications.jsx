import React from 'react';

export default function Notification({notifications}){
    return (
        <div id="notifications">
            {Object.values(notifications).map(notification => {
                if(notification.type != 'nsn'){
                return(
                <div id={notification.id} className={`notification notification-${notification.type}`}>
                    <strong>{notification.type}:</strong> {notification.text}
                </div>
                )
                }
            })}
        </div>
    )
}