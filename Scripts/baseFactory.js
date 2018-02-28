angular
  .module('app')
  .factory('Base',function($http,$location){
    return {

      getAll: function(folder){
        return $http.get("Base/"+folder+"/base.JSON").then(function(base){
          return $http.get("Base/"+folder+"/categories.JSON").then(function(categories){
            return $http.get("Base/"+folder+"/series.JSON").then(function(series){
              return $http.get("Base/"+folder+"/chronology.JSON").then(function(chronology){
                return {
                  "base.JSON": base.data,
                  "categories.JSON": categories.data,
                  "series.JSON": series.data,
                  "chronology.JSON": chronology.data
                }
              },function(error){$location.path('error')})
            },function(error){$location.path('error')})
          },function(error){$location.path('error')})
        },function(error){$location.path('error')})
      },
      convertCategories: function(categories){

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

        result = {}
        Object.keys(categories).map( (id)=>categories[id]).forEach( function(category,i){
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

      },
      createId: function(title,volume,number){
        return title.replace(/ /g,"_")+"_"+volume+"_"+number
      },
      separateId: function(id){
        let values = id.split("_")
        let obj = {}
        obj.number = values.pop()
        obj.volume = values.pop()
        obj.title = values.join(" ")
        return obj
      },
      grabElement: function(description,cover,series){
        class Element{
          constructor(description,cover){
            let allTitle = $($($(description)[0].outerHTML)[0].innerHTML)[0].title
            this.title = allTitle.slice(0,allTitle.indexOf("Vol")-1)
            allTitle = allTitle.slice(this.title.length+5)
            this.volume = allTitle.slice(0,allTitle.indexOf(" "))
            this.number = allTitle.slice(allTitle.indexOf(" ")+1)
            this.id = (this.title+" "+this.volume+" "+this.number).replace(/ /g,"_")
            this.series = [series]
            this.subTitle = (($(description)[2]||{childNodes:{"0":""}}).childNodes["0"]||{data:""}).data
            let publishedDateIndex = this.subTitle ? 5 : 3
            this.publishedDate =
              (($(description)[publishedDateIndex]||{childNodes:{"0":""}}).childNodes["0"]||{data:""}).data
            this.cover = cover
          }
        }
        return new Element(description,cover)
      },
      //http://jsfiddle.net/Zarich/TzVd3/378/
      downloadInnerText: function(filename, elId, mimeType) {
        var elHtml = document.getElementById(elId).innerText;
        var link = document.createElement('a');
        mimeType = mimeType || 'text/plain';

        link.setAttribute('download', filename);
        link.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(elHtml));
        link.click();
      }
    }
  })
