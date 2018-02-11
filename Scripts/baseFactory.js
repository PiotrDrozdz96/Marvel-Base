angular
  .module('app')
  .factory('Base',function($http,$location){
    return {

      get: function(link){
        return $http.get(link).then(function(response){
          return response.data
        },function(error){
          $location.path('error')
        })
      },
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
      createId: function(title,volume,number){
        return title.replace(" ","_")+"_"+volume+"_"+number
      },
      separateId: function(id){
        let values = id.split("_")
        let obj = {}
        obj.number = values.pop()
        obj.volume = values.pop()
        obj.title = values.join(" ")
        return obj
      },
      createElement: function(title,volume,number,series){

        class Element{
          constructor(title,volume,number,series){
            this.title = title
            this.volume = volume
            this.number = number
            this.id = title.replace(" ","_")+"_"+volume+"_"+number
            this.series = series
            this.subTitle = ""
            this.publishedDate = ""
            this.cover = ""
          }
        }
        return new Element(title,volume,number,series)
      }
    }
  })
