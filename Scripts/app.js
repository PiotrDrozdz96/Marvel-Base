angular
  .module('app' , ["ngRoute"] )
  .config(['$routeProvider',function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl: "templates/home.html"
    })
    .when("/MCU",{
      templateUrl: "templates/base.html",
      controller: "mainCtrl",
      resolve: {
        filters: function(Base){return Base.getFilters('Base/MCU')},
        chronologyBase: function(Base){return Base.getChronologyBase('Base/MCU')},
        base: function(Base){return Base.get('Base/MCU/base.JSON')}
      }
    })
    .when("/Fox",{
      templateUrl: "templates/base.html",
      controller: "mainCtrl",
      resolve: {
        filters: function(Base){return Base.getFilters('Base/Fox')},
        chronologyBase: function(Base){return Base.getChronologyBase('Base/Fox')},
        base: function(Base){return Base.get('Base/Fox/base.JSON')}
      }
    })
    .when("/Comics",{
      templateUrl: "templates/base.html",
      controller: "mainCtrl",
      resolve: {
        filters: function(Base){return Base.getFilters('Base/Comics')},
        chronologyBase: function(Base){return Base.getChronologyBase('Base/Comics')},
        base: function(Base){return Base.get('Base/Comics/base.JSON')}
      }
    })
}]);
