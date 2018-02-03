angular
  .module('app')
  .controller('generatorCtrl', function($scope,Base){

    var dialog = {

      exit: function(result){
        $scope.dialogResult = result
        $(".additional_layout").removeClass("on")
        $scope[$scope.dialog](...$scope.dialogParams)
      },

      open: function(template,params){
        if($scope.dialogResult==undefined){
          $scope.dialog = template
          $scope.dialogParams = params
          $(".additional_layout").addClass("on")
          return false
        }
        else{
          return true
        }
      },

      reset: function(){
        $scope.dialog = undefined;
        $scope.dialogResult = undefined;//nie potrzebnie scope
        $scope.dialogParams = undefined;//nie potrzebnie scope
      }

    }

    $scope.exitDialog = (result) => dialog.exit(result)
    $scope.setMode = function(mode){$scope.activeMode = mode}
    $scope.setSeries = function(){$scope.selectedSeries = $scope.categories[$scope.selectedWave].series[0].title}
    let setNewElement = function(){$scope.newElement = {"title":"title","volume":"","number":"","id":"","series":[$scope.selectedSeries],"subTitle":"subTitle","publishedDate":"publishedDate","cover":""}}
    let selectedElements = () => $scope.series[$scope.selectedSeries][$scope.selectedType]
    let elementExist = (id) => $scope.base[id] ? true : false

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

    let addElement = function(id,index){
      $scope.base[id]=$scope.newElement
      selectedElements().splice(index,0,id)
      setNewElement()
      dialog.reset()
    }

    $scope.addElement = function(index){
      if(dialog.open("addElement",[index])){
        if($scope.dialogResult){
          let id = Base.createId($scope.newElement.title,$scope.newElement.volume,$scope.newElement.number)
          if(elementExist(id)){
            dialog.reset()
            $scope.conflictElements(id,index)
          }
          else{
            addElement(id,index)
          }
        }
        else{
          setNewElement()
          dialog.reset()
        }
      }
    }

    $scope.conflictElements = function(id,index){
      $scope.id = id
      if(dialog.open("conflictElements",[id,index])){
        let newId = Base.createId($scope.newElement.title,$scope.newElement.volume,$scope.newElement.number)
        switch ($scope.dialogResult) {
          case "exit":
            setNewElement()
            dialog.reset()
            break;
          case "replace":
            if(id!=newId){
              if(elementExist(newId)){
                dialog.reset()
                $scope.conflictElements(newId,index)
              }
              else{
                $scope.addElement(index)
              }
            }
            else{
              let indexInSeries = selectedElements().findIndex((seriesId) => seriesId == id)
              if(indexInSeries!=-1){
                index = indexInSeries>=index ? index : index-1;
                selectedElements().splice(indexInSeries,1)
              }
              addElement(id,index)
            }
            break;
          case "check":
            if(elementExist(newId)){
              dialog.reset()
              $scope.conflictElements(newId,index)
            }
            else{
              addElement(newId,index)
            }
            break;
        }
      }
    }

  })
