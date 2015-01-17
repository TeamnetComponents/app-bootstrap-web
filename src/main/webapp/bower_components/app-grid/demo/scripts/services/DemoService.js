myServices.factory('DemoService', ['$resource',
    function ($resource) {
       return $resource('http://api.openweathermap.org/data/2.5/weather?id=2172797',{},{
           'getData':{method:'GET'}
//           ,'updateWeather':{method:'PUT'}
       })
    }
]);
