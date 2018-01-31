angular
  .module('app')
  .controller('generatorCtrl', function($scope,Base){

    $scope.modes = {view: {id:"view", value:"Wyświetl"},
                    delete: {id:"delete", value:"Usuwanie /Dodawanie"},
                    edit: {id:"edit", value: "Tryb edycji"},
                    JSON: {id:"JSON", value: "JSON"},
                    array: {id:"array", value: "Array"},
                    volumes: {id:"volumes", value: "Twórz Tomy"}
    }
    $scope.activeMode = "view";
    $scope.setMode = function(mode){$scope.activeMode = mode}
    $scope.setSeries = function(){$scope.selectedSeries = "new"}

    Base.get("Base/Comics/categories.JSON").then(function(data){
      $scope.categories = data;
      $scope.selectedWave = data[Object.keys(data)[0]].title
      $scope.selectedSeries = "new"
      $scope.selectedType = "zeszyty"
    })

    Base.get("Base/Comics/base.JSON").then(function(data){
      $scope.base = data;
    })

    Base.get("Base/Comics/series.JSON").then(function(data){
      $scope.series = data;
    })

    $scope.changeCover = function (id){
      $scope.base[id].cover = prompt('Cover link',$scope.base[id].cover)
    }

    $scope.delete = function(index){
      delete $scope.base[$scope.series[$scope.selectedSeries][$scope.selectedType][index]]
      $scope.series[$scope.selectedSeries][$scope.selectedType].splice(index,1)
    }

    $scope.deleteRest = function(end){
      while ($scope.series[$scope.selectedSeries][$scope.selectedType].length != end){
        delete $scope.base[$scope.series[$scope.selectedSeries][$scope.selectedType].pop()]
      }
    }

    $scope.changeId = function(id,index){
      let newId = $scope.base[id].title.replace(" ","_")+"_"+$scope.base[id].volume+"_"+$scope.base[id].number
      $scope.base[id].id = newId
      $scope.base[newId] = $scope.base[id]
      delete $scope.base[id]
      $scope.series[$scope.selectedSeries][$scope.selectedType][index] = newId
    }

    //dzialają na zewnatrz, ale nie w bazie

    $scope.addElement = function(index){
      $scope.series[$scope.selectedSeries][$scope.selectedType].splice(index,0,"")
    }

  })
