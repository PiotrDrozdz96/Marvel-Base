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
        filters: function(Base){return Base.getFilters('Base/MCU/filters.JSON')},
        chronology: function(Base){return Base.get('Base/MCU/chronology.JSON')},
        base: function(Base){return Base.get('Base/MCU/base.JSON')}
      }
    })
    .when("/Fox",{
      templateUrl: "templates/base.html",
      controller: "mainCtrl",
      resolve: {
        filters: function(Base){return Base.getFilters('Base/Fox/filters.JSON')},
        chronology: function(Base){return Base.get('Base/Fox/chronology.JSON')},
        base: function(Base){return Base.get('Base/Fox/base.JSON')}
      }
    })
    .when("/Comics",{
      templateUrl: "templates/base.html",
      controller: "mainCtrl",
      resolve: {
        filters: function(Base){return Base.getFilters('Base/Comics/filters.JSON')},
        chronology: function(Base){return Base.get('Base/Comics/chronology.JSON')},
        base: function(Base){return Base.get('Base/Comics/base.JSON')}
      }
    })
}]);
