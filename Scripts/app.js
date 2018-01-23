angular
  .module('app' , ["ngRoute"] )
  .config(['$routeProvider',function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl: "templates/home.html"
    })
    .when("/Base/:base",{
      templateUrl: "templates/main.html",
      controller: "baseCtrl",
    })
    .when("/Base/:base/:element",{
      templateUrl: "templates/main.html",
      controller: "baseCtrl",
    })
    .otherwise({
        templateUrl: "templates/error.html"
    });
}])
  // https://www.consolelog.io/angularjs-change-path-without-reloading
  .run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
    var original = $location.path;
    $location.path = function (path, reload) {
        if (reload === false) {
            var lastRoute = $route.current;
            var un = $rootScope.$on('$locationChangeSuccess', function () {
                $route.current = lastRoute;
                un();
            });
        }
        return original.apply($location, [path]);
    };
}])
