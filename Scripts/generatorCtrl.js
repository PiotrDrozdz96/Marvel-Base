angular
  .module('app')
  .controller('generatorCtrl', function($scope,Base,Dialog){

    $scope.setMode = function(mode){$scope.activeMode = mode}
    $scope.setSeries = function(){$scope.selectedSeries = $scope.categories[$scope.selectedWave].series[0].title}
    let setNewElement = function(){$scope.newElement = {"title":"title","volume":"","number":"","id":"","series":[$scope.selectedSeries],"subTitle":"subTitle","publishedDate":"publishedDate","cover":""}}
    let selectedElements = () => $scope.series[$scope.selectedSeries][$scope.selectedType]
    let elementExist = (id) => $scope.base[id] ? true : false
    let argsToId = (obj) => [obj.title,obj.volume,obj.number]

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
      let newId = Base.createId(...argsToId($scope.base[id]))
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

    let addElement = function(id,index){
      $scope.base[id]=$scope.newElement
      selectedElements().splice(index,0,id)
      setNewElement()
    }

    $scope.dialog = Object.assign(Dialog,{
      setNewElement: () => setNewElement(),

      tryAddElement: function(index){
        let id = Base.createId(...argsToId($scope.newElement))
        if(elementExist(id)){ $scope.id = id; Dialog.open('conflictElements',[index]) }
        else addElement(id,index)
      },

      replaceElement: function(index){
        let newId = Base.createId(...argsToId($scope.newElement))
        if($scope.id!=newId){
          if(elementExist(newId)){
            $scope.id = newId; Dialog.open('conflictElements',[index])
          }
          else{
            Dialog.open('addElement',[index])
          }
        }
        else{
          let indexInSeries = selectedElements().findIndex((seriesId) => seriesId == newId)
          if(indexInSeries!=-1){
            index = indexInSeries>=index ? index : index-1;
            selectedElements().splice(indexInSeries,1)
          }
          addElement(newId,index)
        }
      }
    })

  })
