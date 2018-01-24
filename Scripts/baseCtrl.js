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

  //FilterFunctions
    $scope.categoryTick = function(e){

      function checkAll(){
        var allChecked = []
        $.each($scope.categories,function(index,filter){
          if(index!='all') {allChecked.push(filter.checked)}
        })
        if($scope.categories[e.target.id].checked){
          if( allChecked.every( (check) => check) ){
            $scope.categories.all.checked=true;
          }
        }
        else $scope.categories.all.checked=false
      }

      switch($scope.categories[e.target.id].type){
        case 'all':
          if($scope.categories[e.target.id].checked){
            $.each($scope.categories,function(index,filter){
              filter.checked=true;
            })
          }
          else{
            $.each($scope.categories,function(index,filter){
              filter.checked=false;
            })
          }
          break;
        case 'main':
          //children
          if($scope.categories[e.target.id].children){
            $.each($scope.categories[e.target.id].children,function(index,id){
              $scope.categories[id].checked=$scope.categories[e.target.id].checked;
            })
          }
          checkAll();
          break;
        case 'volume':
        case "volume on":
          var groupCheck = []
          $.each($scope.categories[$scope.categories[e.target.id].parent].children,function(index,filter){
            groupCheck.push($scope.categories[filter].checked)
          })
          if($scope.categories[e.target.id].checked){
            if( groupCheck.every( (check) => check) ){
              $scope.categories[$scope.categories[e.target.id].parent].checked=true;
            }
          }
          else $scope.categories[$scope.categories[e.target.id].parent].checked=false
          checkAll();
          break;
        default:
      }
    }

    $scope.dropdown_category = function(e,element){
      var states = ["fa-arrow-down","fa-arrow-up"]
      var state = states.findIndex( (state)=>$(e.target).attr("class").includes(state))

      element.children.forEach(function(id){
        $scope.categories[id].type= state ? "volume" : "volume on"
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
