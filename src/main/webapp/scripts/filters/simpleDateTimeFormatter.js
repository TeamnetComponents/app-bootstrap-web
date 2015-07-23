bootstrapFilters
    .filter('simpleDateTimeFormatter',
    function () {
        return function (someDateTime) {
            if (someDateTime === undefined || someDateTime === null)
                return "N/A";
            return moment(someDateTime).format("DD-MM-YYYY HH:mm");
        }
    });