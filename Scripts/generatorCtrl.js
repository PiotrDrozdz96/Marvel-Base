angular
  .module('app')
  .controller('generatorCtrl', function($scope,Base,Dialog){

    //get Data

    $scope.modes = {view: {id:"view", value:"Wyświetl"},
                    delete: {id:"delete", value:"Usuwanie"},
                    edit: {id:"edit", value: "Edycja /Dodawanie"},
                    JSON: {id:"JSON", value: "JSON"},
                    array: {id:"array", value: "Array"},
                    volumes: {id:"volumes", value: "Twórz Tomy"}
    }

    $scope.setMode = function(mode){$scope.activeMode = mode}

    Base.get("Base/Comics/base.JSON").then(function(data){
      $scope.base = data;
    })

    Base.get("Base/Comics/categories.JSON").then(function(categoriesData){
      $scope.waves = {
        data: categoriesData,
        selected: categoriesData[Object.keys(categoriesData)[1]].title,
        new: "",
        set: function(){this.selected = this.data[Object.keys(this.data)[1]].title},
        add: function(){if(this.new!=""){
          this.data[this.new] = {title:this.new,checked:false,series:[]}
          this.selected = this.new
          this.new = ""
        }},
        remove: function(wave){
          if(confirm("Czy na pewno chcesz usunąć nurt, wraz z seriami i elemenatmi?")){
            while(this.data[wave].series.length!=0){
              $scope.series.remove(wave,this.data[wave].series[0].title,true)
            }
            delete this.data[wave]
            this.set()
            $scope.series.set()
          }
        }
      }
      Base.get("Base/Comics/series.JSON").then(function(seriesData){
        $scope.series = {
          data: seriesData,
          selected: categoriesData[$scope.waves.selected].series[0].title,
          new: "",
          set: function(){this.selected = $scope.waves.data[$scope.waves.selected].series[0].title},
          add: function(){if(this.new!=""){
            $scope.waves.data[$scope.waves.selected].series.push({title:this.new,checked:false})
            this.data[this.new] = {zeszyty:[],tomy:[]}
            this.selected = this.new
            this.new = ""
          }},
          remove: function(wave,series,message){
            if(series!=null && (message || confirm("Czy na pewno chcesz usunąć serię, wraz ze wszystkimi elementami?"))){
              this.data[series].zeszyty.concat(this.data[series].tomy).forEach(
                function(id){ delete $scope.base[id] } )
              delete this.data[series]
              let index = $scope.waves.data[wave].series.findIndex((child) => child.title==series)
              $scope.waves.data[wave].series.splice(index,1)
              if($scope.waves.data[wave].series.length!=0) this.set()
            }
          }
        }
      })
      $scope.selectedType = "zeszyty"
    })

    //element functions
    $scope.element = {
      exist: (id) => $scope.base[id] ? true : false,
      changeCover: function (id){
        $scope.base[id].cover = prompt('Cover link',$scope.base[id].cover)
      },
      selected: () => $scope.series.data[$scope.series.selected].zeszyty,
      deleteRest: function(end){
        while (this.selected().length != end){
          delete $scope.base[this.selected().pop()]
        }
      },
      delete: function(index){
        delete $scope.base[this.selected()[index]]
        this.selected().splice(index,1)
      },
      add: function(id,index){
        $scope.base[id]=$scope.newElement
        this.selected().splice(index,0,id)
        setNewElement()
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
        $scope.element.selected()[index] = newId
      }
    }

    let setNewElement = function(){$scope.newElement = {"title":"title","volume":"","number":"","id":"","series":[$scope.selectedSeries],"subTitle":"subTitle","publishedDate":"publishedDate","cover":""}}
    let argsToId = (obj) => [obj.title,obj.volume,obj.number]


    $scope.setMode("view")
    $scope.unPackVolume = {id:"",index:0,wave:"",series:""}
    setNewElement();

    $scope.changeNewElementCover = function (){
      $scope.newElement.cover = prompt('Cover link',$scope.newElement.cover)
    }

    $scope.dialog = Object.assign(Dialog,{
      setNewElement: () => setNewElement(),

      tryAddElement: function(index){
        let id = Base.createId(...argsToId($scope.newElement))
        if($scope.element.exist(id)){ $scope.id = id; Dialog.open('conflictElements',[index]) }
        else $scope.element.add(id,index)
      },

      replaceElement: function(index){
        let newId = Base.createId(...argsToId($scope.newElement))
        if($scope.id!=newId){
          if($scope.element.exist(newId)){
            $scope.id = newId; Dialog.open('conflictElements',[index])
          }
          else{
            Dialog.open('addElement',[index])
          }
        }
        else{
          let indexInSeries = $scope.element.selected().findIndex((seriesId) => seriesId == newId)
          if(indexInSeries!=-1){
            index = indexInSeries>=index ? index : index-1;
            $scope.element.selected().splice(indexInSeries,1)
          }
          $scope.element.add(newId,index)
        }
      }
    })

    //Generate volumes

    $scope.unPack = function(id){
      $scope.id = id
      $scope.unPackVolume = {
        "id": id,
        index:$scope.base[id].children.length,
        wave: $scope.waves.selected,
        series: $scope.series.selected
      }
    }

    $scope.unPackIndex = function(index){
      $scope.unPackVolume.index = index
    }

    $scope.pack = function(){
      $scope.id = ""
      $scope.unPackVolume.id = ""
      $scope.waves.selected = $scope.unPackVolume.wave
      $scope.series.selected = $scope.unPackVolume.series
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
