const activityCodeColors = {
    "CONFLICT": "error",
    "TEST": "deep",
    "MAINTENANCE": "tan",
    "SUPPORT": "support",
    "CHECKOUT": "violet",
    "INSTRUMENTATION CHECKOUT": "violet",
    "REMOVAL": "maroon",
    "0": "smoke",
    "1": "good",
    "2": "warn",
    "3": "mint",
};

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


