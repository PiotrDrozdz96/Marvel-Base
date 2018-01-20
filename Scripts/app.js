angular
  .module('app' , ["ngRoute"] )
  .config(['$routeProvider',function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl: "templates/home.html"
    })
    .when("/Base/:base",{
      templateUrl: "templates/base.html",
      controller: "baseCtrl",
      resolve: {
        filters: function($route,Base){
          return Base.getFilters('Base/'+$route.current.params.base+'/filters.JSON')},
        chronology: function($route,Base){
          return Base.get('Base/'+$route.current.params.base+'/chronology.JSON')},
        base: function($route,Base){
          return Base.get('Base/'+$route.current.params.base+'/base.JSON')}
      }
    })
}]);
