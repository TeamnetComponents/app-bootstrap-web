
bootstrapServices.factory('LanguageService',['$http', '$translate', 'LANGUAGES', function ($http, $translate, LANGUAGES) {
    return {
        getBy: function(language) {
            if (language == undefined) {
                language = $translate.storage().get('NG_TRANSLATE_LANG_KEY');
            }
            if (language == undefined) {
                language = 'en';
            }
            return $http.get('i18n/' + language + '.json').then(function (response) {
                return LANGUAGES;
            });
        }
    };
}]);