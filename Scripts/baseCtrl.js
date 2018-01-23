angular
  .module('app')
  .controller('baseCtrl', function($scope,$location,$route,Base){

    let baseId = () => $route.current.params.base
    $scope.isElement = $route.current.params.element

    Base.getFilters(baseId()).then(function(data){
      $scope.filters = data;
    })

    Base.getBase(baseId()).then(function(data){
      $scope.base = data;
      if(!$scope.isElement){
        Base.get("Base/"+baseId()+"/chronology.JSON").then(function(data2){
          $scope.chronology = data2;
        })
      }
      else $scope.chronology = [$scope.isElement].concat(data[$scope.isElement].children)
    })


    $scope.filterByCategory = function (filters) {
      return function(id){
        return $scope.base[id].series.some( (category) => filters[category].checked)
      }
    };

  //FilterFunctions
    $scope.filterFunction = function(e){

      function checkAll(){
        var allChecked = []
        $.each($scope.filters,function(index,filter){
          if(index!='all') {allChecked.push(filter.checked)}
        })
        if($scope.filters[e.target.id].checked){
          if( allChecked.every( (check) => check) ){
            $scope.filters.all.checked=true;
          }
        }
        else $scope.filters.all.checked=false
      }

      switch($scope.filters[e.target.id].category){
        case 'all':
          if($scope.filters[e.target.id].checked){
            $.each($scope.filters,function(index,filter){
              filter.checked=true;
            })
          }
          else{
            $.each($scope.filters,function(index,filter){
              filter.checked=false;
            })
          }
          break;
        case 'main':
          //children
          if($scope.filters[e.target.id].children){
            $.each($scope.filters[e.target.id].children,function(index,id){
              $scope.filters[id].checked=$scope.filters[e.target.id].checked;
            })
          }
          checkAll();
          break;
        case 'volume':
        case "volume on":
          var groupCheck = []
          $.each($scope.filters[$scope.filters[e.target.id].parent].children,function(index,filter){
            groupCheck.push($scope.filters[filter].checked)
          })
          if($scope.filters[e.target.id].checked){
            if( groupCheck.every( (check) => check) ){
              $scope.filters[$scope.filters[e.target.id].parent].checked=true;
            }
          }
          else $scope.filters[$scope.filters[e.target.id].parent].checked=false
          checkAll();
          break;
        default:
      }
    }

    $scope.dropdown_filter = function(e,element){
      var states = ["fa-arrow-down","fa-arrow-up"]
      var state = states.findIndex( (state)=>$(e.target).attr("class").includes(state))

      element.children.forEach(function(id){
        $scope.filters[id].category= state ? "volume" : "volume on"
      })

      $(e.target).removeClass(states[state]).addClass(states[~~!state])
    }

    $scope.showElement = function(id){
      if(id){
        $location.path($location.path()+"/"+id,false)
        $scope.isElement = true
        $scope.chronology = $scope.base[id].children ? [id].concat($scope.base[id].children) : [id]
      }
      else{
        $location.path($location.path().substr(1,$location.path().lastIndexOf("/")-1),false)
        $scope.isElement = false
        Base.get("Base/"+baseId()+"/chronology.JSON").then(function(data){
          $scope.chronology = data;
        })
      }

    }

  })
