angular
  .module('app')
  .factory('Base',['$http', function($http){
    var test = function(link){
      return $http.get(link).then(function(response){
        return response.data })
    }

    return {
      get: function(link){
        return $http.get(link).then(function(response){
          return response.data })
      },
      getFilters: function(path){

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

        return $http.get(path+"/filters.JSON").then(function(filters){
          result = {}
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
        })
      },
      getChronologyBase: function(path){
        return $http.get(path+"/chronology.JSON").then(function(chronology){
          return $http.get(path+"/base.JSON").then(function(base){
            var chronologyBase = [];
            $.each(chronology.data,function(index,id){
              chronologyBase[index]=base.data[id]
            })
            return chronologyBase
          })
        })
      }
      
    }
  }])
