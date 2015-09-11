bootstrapFilters
    .filter('simpleDateFormatter',
    function () {
        return function (someDate) {
            return moment(someDate).format("DD/MM/YYYY");
        }
    });