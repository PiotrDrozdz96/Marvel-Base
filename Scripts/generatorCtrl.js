angular
  .module('app')
  .controller('generatorCtrl', function($scope,Base,Dialog){

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

    $scope.setMode = function(mode){$scope.activeMode = mode}
    $scope.setSeries = function(){$scope.selectedSeries = $scope.categories[$scope.selectedWave].series[0].title}
    let setNewElement = function(){$scope.newElement = {"title":"title","volume":"","number":"","id":"","series":[$scope.selectedSeries],"subTitle":"subTitle","publishedDate":"publishedDate","cover":""}}
    let selectedElements = () => $scope.series[$scope.selectedSeries].zeszyty//zmienić na parametr
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
    $scope.unPackVolume = {id:"",index:0,wave:"",series:""}
    setNewElement();

    $scope.changeCover = function (id){
      $scope.base[id].cover = prompt('Cover link',$scope.base[id].cover)
    }

    $scope.changeNewElementCover = function (){
      $scope.newElement.cover = prompt('Cover link',$scope.newElement.cover)
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
      if($scope.base[newId]){
        alert("Istnieje taki element")
        $scope.base[id] = Object.assign($scope.base[id], Base.separateId(id))
      }
      else{
        $scope.base[id].id = newId
        $scope.base[newId] = $scope.base[id]
        delete $scope.base[id]
        selectedElements()[index] = newId
      }
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

    //Generate volumes

    $scope.unPack = function(id){
      $scope.id = id
      $scope.unPackVolume = {
        "id": id,
        index:$scope.base[id].children.length,
        wave: $scope.selectedWave,
        series: $scope.selectedSeries
      }
    }

    $scope.unPackIndex = function(index){
      $scope.unPackVolume.index = index
    }

    $scope.pack = function(){
      $scope.id = ""
      $scope.unPackVolume.id = ""
      $scope.selectedWave = $scope.unPackVolume.wave
      $scope.selectedSeries = $scope.unPackVolume.series
    }

    $scope.removeChild = function(index){
      $scope.base[$scope.unPackVolume.id].children.splice(index,1)
      if($scope.unPackVolume.index>index) $scope.unPackVolume.index--
    }

    $scope.addChild = function(id){
      if($scope.base[$scope.unPackVolume.id].children.findIndex((c) => c==id)==-1){
        $scope.base[$scope.unPackVolume.id].children.splice($scope.unPackVolume.index,0,id)
        $scope.unPackVolume.index++
      }
      else alert("Element znajduje się już na liście")
    }

    //Dodawanie nowych tomów
    //Usuwanie Serii i Nurtów

  })
