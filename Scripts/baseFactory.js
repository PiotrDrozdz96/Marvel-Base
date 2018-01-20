angular
  .module('app')
  .factory('Base',['$http','$location', function($http,$location){
    return {
      get: function(link){
        return $http.get(link).then(function(response){
          return response.data
        },function(error){
          $location.path('error')
        })
      },
      getFilters: function(link){

        class Filter{
          constructor(title,id,checked,series,parent){
            this.id = id
            this.title = title
            this.category = series ? "main" : "volume"
            this.children = series ? series.map( (seria) => seria.title ) : undefined
            this.checked = checked
            this.parent = parent
          }
        }

        return $http.get(link).then(function(filters){
          result = {}
          console.log($location.path());
          Object.keys(filters.data).map( (id)=>filters.data[id]).forEach( function(filter,i){
            if(i==0){
              result.all = {"id":"all","category":"all","title":filter.title,"checked":false}
            }
            else{
              result[filter.title+"_wave"] = new Filter(filter.title,filter.title+"_wave",filter.checked,filter.series)
            }
            if(filter.series){
              filter.series.forEach(function(seria){
                result[seria.title] = new Filter(seria.title,seria.title,seria.checked,undefined,filter.title+"_wave")
              })
            }
          })
          return result
        },function(error){
          $location.path('error')
        })
      }
    }
  }])
