const notificationContainer = document.getElementById('notification-container');
const NOTIFICATION_TYPES = {
	INFO: 'info',
	SUCCESS: 'success',
	WARNING: 'warning',
	DANGER: 'danger'
}

function addNotification(type, text) {
    // create the DIV and add the required classes
    const newNotification = document.createElement('div');
    newNotification.classList.add('notification', `notification-${type}`);

    const innerNotification = `
		<strong>${type}:</strong> ${text}
	`;

    // insert the inner elements
    newNotification.innerHTML = innerNotification;

    // add the newNotification to the container
    notificationContainer.appendChild(newNotification);

    return newNotification;
}

function removeNotification(notification) {
	notification.classList.add('hide');

	// remove notification from the DOM after 0.5 seconds
	setTimeout(() => {
		notificationContainer.removeChild(notification);
	}, 500);
}

// adding and removing notification for DEMO purposes
const info = addNotification(NOTIFICATION_TYPES.INFO, 'Info text added');
setTimeout(() => {
	removeNotification(info);
}, 5000);

setTimeout(() => {
	const success = addNotification(NOTIFICATION_TYPES.SUCCESS, 'You are the boss!');
	setTimeout(() => {
		removeNotification(success);
	}, 5000);
}, 1000);

setTimeout(() => {
	const warning = addNotification(NOTIFICATION_TYPES.WARNING, 'Be careful!');
	setTimeout(() => {
		removeNotification(warning);
	}, 5000);
}, 2200);

setTimeout(() => {
	const danger = addNotification(NOTIFICATION_TYPES.DANGER, 'Noooooooo!');
	setTimeout(() => {
		removeNotification(danger);
	}, 5000);
}, 3700);
