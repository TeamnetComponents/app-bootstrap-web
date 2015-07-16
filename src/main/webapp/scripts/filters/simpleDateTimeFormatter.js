bootstrapFilters
    .filter('simpleDateTimeFormatter',
    function () {
        return function (someDateTime) {
            return moment(someDateTime).format("DD-MM-YYYY HH:mm");
        }
    });