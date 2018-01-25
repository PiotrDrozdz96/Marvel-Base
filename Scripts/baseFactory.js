angular
  .module('app')
  .factory('Base',['$http','$location', function($http,$location){
    return {
      getCategories: function(baseId){

        class Category{
          constructor(title,checked,series,parent){
            this.id = title+(series ? "_wave" : "")
            this.title = title
            this.type = series ? "main" : "secondary"
            this.children = series ? series.map( (seria) => seria.title ) : undefined
            this.checked = checked
            this.parent = parent
          }
        }

        return $http.get('Base/'+baseId+'/categories.JSON').then(function(categories){
          result = {}
          Object.keys(categories.data).map( (id)=>categories.data[id]).forEach( function(category,i){
            if(i==0){
              result.all = {id:"all",type:"all",title:category.title,"checked":false}
            }
            else{
              result[category.title+"_wave"] = new Category(category.title,category.checked,category.series)
            }
            if(category.series){
              category.series.forEach(function(child){
                result[child.title] = new Category(child.title,child.checked,undefined,category.title+"_wave")
              })
            }
          })
          return result
        },function(error){
          $location.path('error')
        })
      },
      getBase: function(baseId){
        return $http.get('Base/'+baseId+'/base.JSON').then(function(response){
          return response.data
        },function(error){
          $location.path('error')
        })
      },
      getChronology: function(baseId){
        return $http.get("Base/"+baseId+"/chronology.JSON").then(function(response){
          return response.data
        },function(error){
          $location.path('error')
        })
      }
    }
  }])
