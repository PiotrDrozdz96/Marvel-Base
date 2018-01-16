angular
  .module('app')
  .controller('mainCtrl', function($scope,filters,chronologyBase,base){

    $scope.filters = filters;
    $scope.chronologyBase = chronologyBase;

    $scope.filterByCategory = function (filters) {
      return function(element){
        return element.series.some( (category) => filters[category].checked)
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

    //upack Volume

    $scope.biggerOn = function (e){
      $scope.hightGroundVolume = e
      $scope.hightGroundChildren = e.children ? e.children.map( (id) => base[id] ) :[]
      $(".hightGround").addClass("on")
    }

    $scope.biggerOff = function(){
      $(".hightGround").removeClass("on")
    }

  })
