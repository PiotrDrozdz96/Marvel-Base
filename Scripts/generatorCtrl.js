angular
  .module('app')
  .controller('generatorCtrl', function($scope,Base){

    $scope.setMode = function(mode){$scope.activeMode = mode}
    $scope.setSeries = function(){$scope.selectedSeries = $scope.categories[$scope.selectedWave].series[0].title}
    let setNewElement = function(){$scope.newElement = {"title":"title","volume":"","number":"","id":"","series":[$scope.selectedSeries],"subTitle":"subTitle","publishedDate":"publishedDate","cover":""}}
    let selectedElements = () => $scope.series[$scope.selectedSeries][$scope.selectedType]

    $scope.modes = {view: {id:"view", value:"Wyświetl"},
                    delete: {id:"delete", value:"Usuwanie"},
                    edit: {id:"edit", value: "Edycja /Dodawanie"},
                    JSON: {id:"JSON", value: "JSON"},
                    array: {id:"array", value: "Array"},
                    volumes: {id:"volumes", value: "Twórz Tomy"}
    }
    $scope.activeMode = "view";
    $scope.newWave = "";
    $scope.newSeries = "";
    setNewElement();

    Base.get("Base/Comics/categories.JSON").then(function(data){
      $scope.categories = data;
      $scope.selectedWave = data[Object.keys(data)[1]].title
      $scope.selectedSeries = data[$scope.selectedWave].series[0].title
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
      delete $scope.base[selectedElements()[index]]
      selectedElements().splice(index,1)
    }

    $scope.deleteRest = function(end){
      while (selectedElements().length != end){
        delete $scope.base[selectedElements().pop()]
      }
    }

    $scope.changeId = function(id,index){
      let newId = Base.createId($scope.base[id].title,$scope.base[id].volume,$scope.base[id].number)
      $scope.base[id].id = newId
      $scope.base[newId] = $scope.base[id]
      delete $scope.base[id]
      selectedElements()[index] = newId
    }

    $scope.addWave = function(){
      $scope.categories[$scope.newWave] = {title:$scope.newWave,checked:false,series:[]}
      $scope.selectedWave = $scope.newWave
      $scope.newWave = ""
    }

    $scope.addSeries = function(){
      $scope.categories[$scope.selectedWave].series.push({title:$scope.newSeries,checked:false})
      $scope.selectedSeries = $scope.newSeries
      $scope.newSeries = ""
    }

//Nowe testowe
  var tempIndex;
  $scope.openDialog = function(index){
    $(".additional_layout").addClass("on")
    tempIndex = index;
  }

  $scope.exitDialog = function(){
    $(".additional_layout").removeClass("on")
  }

  $scope.addElement = function(){
    let id = Base.createId($scope.newElement.title,$scope.newElement.volume,$scope.newElement.number)
    $scope.base[id]=$scope.newElement
    $scope.series[$scope.selectedSeries][$scope.selectedType].splice(tempIndex,0,id)
    $scope.exitDialog()
    setNewElement()
  }


  })
