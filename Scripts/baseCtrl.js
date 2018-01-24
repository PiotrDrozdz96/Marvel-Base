angular
  .module('app')
  .controller('baseCtrl', function($scope,$location,$route,Base){

    let baseId = () => $route.current.params.base
    $scope.isElement = $route.current.params.element

    Base.getCategories(baseId()).then(function(data){
      $scope.categories = data;
    })

    Base.getBase(baseId()).then(function(base){
      $scope.base = base;
      if(!$scope.isElement){
        Base.getChronology(baseId()).then(function(data){
          $scope.chronology = data;
        })
      }
      else $scope.chronology = [$scope.isElement].concat(base[$scope.isElement].children)
    })


    $scope.filterByCategory = function (filters) {
      return function(id){
        return $scope.base[id].series.some( (category) => filters[category].checked)
      }
    };

  //CategoryFunctions
    $scope.categoryTick = function(e){

      let category = () => $scope.categories[e.target.id]

      function checkAll(arrayId,parentId){
        if (category().checked && (arrayId)
            .map((categoryId) => $scope.categories[categoryId].checked)
              .every( (check) => check) ){
                $scope.categories[parentId].checked=true;
              }
        else $scope.categories[parentId].checked=false
      }

      function changeAll(arrayId,value){
        $.each(arrayId,function(index,category){
          $scope.categories[category].checked = value
        })
      }

      switch(category().type){
        case "all":
          changeAll(Object.keys($scope.categories),category().checked)
          break;
        case "main":
          changeAll(category().children,category().checked)
          checkAll(Object.keys($scope.categories).slice(1,-1),"all");
          break;
        case "secondary":
        case "secondary on":
          checkAll($scope.categories[category().parent].children,category().parent)
          checkAll(Object.keys($scope.categories).slice(1,-1),"all");
          break;
        default:
      }
    }

    $scope.dropdown_category = function(e,element){
      var states = ["fa-arrow-down","fa-arrow-up"]
      var state = states.findIndex( (state)=>$(e.target).attr("class").includes(state))

      element.children.forEach(function(id){
        $scope.categories[id].type= state ? "secondary" : "secondary on"
      })

      $(e.target).removeClass(states[state]).addClass(states[~~!state])
    }

    $scope.showElement = function(id){
      if(id){
        $location.path($location.path()+"/"+id,false)
        $scope.isElement = id
        $scope.chronology = $scope.base[id].children ? [id].concat($scope.base[id].children) : [id]
      }
      else{
        $location.path($location.path().substr(1,$location.path().lastIndexOf("/")-1),false)
        $scope.isElement = false
        Base.getChronology(baseId()).then(function(data){
          $scope.chronology = data;
        })
      }

    }

  })
