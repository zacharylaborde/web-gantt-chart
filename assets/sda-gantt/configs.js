async function getActivityCodeColors() {
    return fetch('/sda-gantt/get-activity-code-colors')
        .then((response) => response.json())
        .then((data) => {return data});
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

Date.prototype.getWeek = function() {
    currentDate = this;
    startDate = new Date(currentDate.getFullYear(), 0, 1);
    return Math.ceil(Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000)) / 7);
}

Date.prototype.dayEquals = function(date) {
    return this.toLocaleDateString() === new Date(date).toLocaleDateString();
}

Date.prototype.asHTMLWeek = function() {
    return `${this.getFullYear()}-W${this.getWeek().toString().padStart(2, '0')}`;
}
