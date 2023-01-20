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


