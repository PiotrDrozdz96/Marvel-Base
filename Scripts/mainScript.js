var app = angular.module('aplikacja' , [] );

app.controller('Main-Ctrl', ['$scope', function($scope){

//Base

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

  $scope.loadBase = function(filtersJSON,chronologyJSON,BaseJSON){

    $.getJSON(filtersJSON,function(filters){
      $scope.filters = {}
      Object.keys(filters).map( (id)=>filters[id]).forEach( function(filter,i){
        if(i==0){
          $scope.filters.all = {"id":"all","category":"all","title":filter.title,"checked":false}
        }
        else{
          $scope.filters[filter.title+"_wave"] = new Filter(filter.title,filter.title+"_wave",filter.checked,filter.series)
        }
        if(filter.series){
          filter.series.forEach(function(seria){
            $scope.filters[seria.title] = new Filter(seria.title,seria.title,seria.checked,undefined,filter.title+"_wave")
          })
        }
      })
    })

    $.getJSON(chronologyJSON, function(chronology) {
      $.getJSON(BaseJSON,function(base){
        var chronologyBase = [];
        $.each(chronology,function(index,id){
          chronologyBase[index]=base[id]
        })
      $scope.$apply(function(){
          $scope.chronologyBase = chronologyBase;
        })
      })
    })
  }

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

  //Reload page
  $scope.page = 'main';
  $scope.loadBase('Base/MCU/filters.JSON','Base/MCU/chronology.JSON','Base/MCU/Base.JSON');

  $scope.changePage = function(page,filtersJSON,chronologyJSON,BaseJSON){
    $scope.page = page;
    $scope.generateMode = "normalMode"
    if(page=='base'){
      $scope.loadBase(filtersJSON,chronologyJSON,BaseJSON);
    }
  }

  $scope.biggerOn = function (e){
    $.getJSON('Base/Comics/Base.JSON',function(base){
      $scope.$apply(function(){
        $scope.hightGroundVolume = e
        $scope.hightGroundChildren = e.children ? e.children.map( (id) => base[id] ) :[]
      })
      $(".hightGround").addClass("on")
    })
  }

  $scope.biggerOff = function(){
    $(".hightGround").removeClass("on")
  }

}])
