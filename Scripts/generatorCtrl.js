angular
  .module('app')
  .controller('generatorCtrl', function($scope,Base,Dialog){

    //Data
    $scope.modes = {view: {id:"view", value:"Wyświetl"},
                    delete: {id:"delete", value:"Usuwanie"},
                    edit: {id:"edit", value: "Edycja /Dodawanie"},
                    JSON: {id:"JSON", value: "JSON"},
                    array: {id:"array", value: "Array"},
                    volumes: {id:"volumes", value: "Twórz Tomy"}
    }
    $scope.activeMode = "view"
    $scope.setMode = function(mode){
      $scope.activeMode = mode
      $scope.series.type = mode=="volumes" ? "tomy" : "zeszyty"
      if($scope.volumes.id) $scope.volumes.pack()
    }

    Base.get("Base/Comics/base.JSON").then(function(data){
      $scope.base = data;
    })

    //Categories
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
          type: "zeszyty",
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
    })

    //Element functions
    let argsToId = (obj) => [obj.title,obj.volume,obj.number]

    $scope.element = {
      exist: (id) => $scope.base[id] ? true : false,
      changeCover: function (id){
        $scope.base[id].cover = prompt('Cover link',$scope.base[id].cover)
      },
      selected: () => $scope.series.data[$scope.series.selected][$scope.series.type],
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
        $scope.base[id]=$scope.newElement.get()
        if($scope.series.type=="tomy") $scope.base[id].children=[]
        this.selected().splice(index,0,id)
        $scope.newElement.set()
      },
      changeId: function(id,index){
        let newId = Base.createId(...argsToId($scope.base[id]))
        if($scope.base[newId]){
          alert("Istnieje taki element")
          $scope.base[id] = Object.assign($scope.base[id], Base.separateId(id))
        }
        else{
          $scope.base[id].id = newId
          $scope.base[newId] = $scope.base[id]
          delete $scope.base[id]
          this.selected()[index] = newId
        }
      }
    }

    //New element
    $scope.newElement = {
      get:function(){ return{title:this.title,volume:this.volume,number:this.number,id:this.id,
            series:[$scope.series.selected],subTitle:this.subTitle,
            publishedDate:this.publishedDate,cover:this.cover}},
      set: function(){
        this.title="title"; this.volume=""; this.number=""; this.id= "";
        this.subTitle="subTitle", this.publishedDate="publishedDate"; this.cover=""
      },
      changeCover: function(){this.cover = prompt('Cover link',this.cover)}
    }
    $scope.newElement.set()

    //Dialogs
    $scope.dialog = Object.assign(Dialog,{
      setNewElement: () => $scope.newElement.set(),

      tryAddElement: function(index){
        let id = Base.createId(...argsToId($scope.newElement.get()))
        if($scope.element.exist(id)){ $scope.id = id; Dialog.open('conflictElements',[index]) }
        else $scope.element.add(id,index)
      },

      replaceElement: function(index){
        let newId = Base.createId(...argsToId($scope.newElement.get()))
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

    $scope.volumes = {
      id: "", index: 0, wave: "", series: "",
      setIndex: function(index){this.index=index},
      unPack: function(id){
        $scope.id = this.id = id
        this.index = $scope.base[id].children.length
        this.wave = $scope.waves.selected
        this.series =  $scope.series.selected
      },
      pack: function(){
        $scope.base[$scope.id].series = $scope.base[$scope.id].children.reduce(
          (total,current)=> total.findIndex((c)=>c==$scope.base[current].series[0])==-1 ?
            total.concat([$scope.base[current].series[0]]) : total
        ,[] )
        $scope.id = this.id = ""
        $scope.waves.selected = this.wave
        $scope.series.selected = this.series
      },
      addChild: function(id){
        if($scope.base[this.id].children.findIndex((c) => c==id)==-1){
          $scope.base[this.id].children.splice(this.index,0,id)
          this.index++
        }
        else alert("Element znajduje się już na liście")
      },
      removeChild: function(index){
        $scope.base[this.id].children.splice(index,1)
        if(this.index>index) this.index--
      }
    }

  })
