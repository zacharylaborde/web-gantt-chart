class UpdateManager {
    constructor() {
        this.socket = io.connect();
    }

    createEvent(event) {
        let req = {
            name: event.name,
            activityCode: event.activityCode,
            day: event.day,
            parentRowName: event.parentRowName,
            options: event.options,
        }
        this.socket.emit('create', req)
    }

    updateEvent(event, propertyName, to) {
        let req = {
            event: event.id,
            property: propertyName,
            to: to
        };
        this.socket.emit('update', req);
    }

    deleteEvent(eventId) {
        let req = {event: eventId};
        this.socket.emit('delete', req);
    }

    async gatherEventTypes() {
        return fetch("/sda-gantt/get-event-types",{
            credentials: "include"
        })
            .then((response) => response.json())
            .then((data) => {return data.sections});
    }

    async gatherEvents(schedule, start, numDays) {
        return fetch("/sda-gantt/get-events", {
            method: 'UPDATE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({schedule: schedule, startDay: start, numDays: numDays})
        })
            .then((response) => response.json())
            .then((data) => {return data.events});
    }

    async gatherConflicts(schedule, startDay, numDays) {
        return fetch("sda-gantt/get-conflicts-and-warnings", {
            credentials: "include",
            method: "UPDATE",
            body: JSON.stringify({scheduleString: "2023W1S1", startDay: startDay, numDays: numDays})
        })
            .then((response) => response.json())
            .then((data) => {return data.conflicts});
    }

    async gatherWarnings(schedule, startDay, numDays) {
        return fetch("sda-gantt/get-conflicts-and-warnings", {
            credentials: "include",
            method: "UPDATE",
            body: JSON.stringify({scheduleString: "2023W1S1", startDay: startDay, numDays: numDays})
        })
            .then((response) => response.json())
            .then((data) => {return data.warnings});
    }

    async gatherConflictsAndWarnings(startDay, numDays) {
        return fetch("sda-gantt/get-conflicts-and-warnings", {
            credentials: "include",
            method: "UPDATE",
            body: JSON.stringify({scheduleString: "2023W1S1", startDay: startDay, numDays: numDays})
        })
            .then((response) => response.json())
            .then((data) => {return data});
    }

    async getAllProjects() {
        return fetch("sda-gantt/get-all-projects", {
            credentials: "include",
        })
            .then((response) => response.json())
            .then((data) => {return data.projects})
    }
}