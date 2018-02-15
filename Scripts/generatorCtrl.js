angular
  .module('app')
  .controller('generatorCtrl', function($scope,Base,Dialog){

    //Data
    $scope.modes = [{id:"view", value:"Wyświetl"},
                    {id:"delete", value:"Usuwanie"},
                    {id:"edit", value: "Edycja /Dodawanie"},
                    {id:"volumes", value: "Twórz Tomy"},
                    {id:"chronology", value: "Twórz chronologie"},
                    {id:"base.JSON", value: "base.JSON"},
                    {id:"categories.JSON", value: "categories.JSON"},
                    {id:"series.JSON", value: "series.JSON"}
    ]
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
          if(!this.data[this.new]){
            this.data[this.new] = {title:this.new,checked:false,series:[]}
            this.selected = this.new
          }
          else alert("Istnieje taki nurt")
          this.new = ""
        }},
        remove: function(wave){
          if(confirm("Czy na pewno chcesz usunąć nurt, wraz z seriami i elemenatmi?")){
            while(this.data[wave].series.length!=0){
              $scope.series.remove(wave,this.data[wave].series[0].title,true)
            }
            delete this.data[wave]
            if(Object.keys(this.data)[1]){
              this.set()
              $scope.series.set()
            }
            else{this.selected=""; $scope.series.selected=""}
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
          add: function(){if(this.new!="" && $scope.waves.selected!=""){
            if(!this.data[this.new]){
              $scope.waves.data[$scope.waves.selected].series.push({title:this.new,checked:false})
              this.data[this.new] = {zeszyty:[],tomy:[]}
              this.selected = this.new
            }
            else alert("Istnieje taka seria")
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
              else this.selected=""
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

      tryAddElement: function(index,nextElements){
        let id = Base.createId(...argsToId($scope.newElement.get()))
        if($scope.element.exist(id)){ $scope.id = id; Dialog.open('conflictElements',[index]) }
        else {
          $scope.element.add(id,index)
          if(nextElements) this.tryAddElements(index+1,nextElements)
        }
      },

      grabElements: function(index,pageString){
        let items = $(pageString).find(".wikia-gallery-item ")
        this.tryAddElements(index,items)
      },

      tryAddElements: function(index,items){
        let item = items.get(0)
        items.splice(0,1)
        $scope.newElement = Object.assign($scope.newElement,
                            Base.grabElement($(item).find('.lightbox-caption div').html(),
                            $(item).find('img').attr('src'),$scope.series.selected) )
        let id = $scope.newElement.id
        if(!$scope.element.exist(id)){
          $scope.element.add(id,index)
          if(items.length!=0) this.tryAddElements(index+1,items)
        }
        else{
          $scope.id = id
          Dialog.open('conflictGrabingElement',[index,items])
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

    Base.get("Base/Comics/chronology.JSON").then(function(chronologyData){
      $scope.chronology = {
        data: chronologyData,
        index: chronologyData.length,
        selected: "zeszyty",
        setIndex: function(index){this.index=index},
        add: function(id){
          if(this.data.findIndex((c) => c==id)==-1){
            this.data.splice(this.index,0,id)
            this.index++
          }
          else alert("Element znajduje się już na liście")
        },
        remove: function(index){
          this.data.splice(index,1)
          if(this.index>index) this.index--
        }
      }
    })

  })
