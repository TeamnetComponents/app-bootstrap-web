bootstrapFilters
    .filter('yesNoBooleanFormatter',
    function () {
        var boolLabels = {
            true: "Yes",
            false: "No"
        };
        return function (someBooleanValue) {
            if (someBooleanValue === undefined || someBooleanValue === null)
                return "N/A";
            if (typeof(someBooleanValue) === 'boolean') {
                return boolLabels[someBooleanValue];
            }
            if (typeof(someBooleanValue) === 'string') {
                return boolLabels[someBooleanValue.toLowerCase() === 'true' || someBooleanValue === '1'];
            }
            if (typeof(someBooleanValue) === 'number') {
                return boolLabels[someBooleanValue === 1];
            }
            return someBooleanValue;
        }
    });