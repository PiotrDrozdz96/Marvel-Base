angular
  .module('app')
  .controller('baseCtrl', function($scope,$location,$route,Base,Dialog){

    //https://www.javascripture.com/FileReader
    //readAsText example
    $scope.openFile = function(event){
      $scope.temp = {}
      var input = event

      var reader = []
      for(let i=0; i<input.files.length; i++){
        reader[i] = new FileReader();
        reader[i].readAsText(input.files[i])
        reader[i].onload = function(){
          $scope.temp[input.files[i].name] = JSON.parse(reader[i].result)
        }
      }
    }

    let loadBase = function(data){
      $scope.base = data["base.JSON"]
      $scope.categories = data["categories.JSON"]
      chronology = data["chronology.JSON"]
      if(!$scope.element){
        $scope.chronology = chronology
      }
      else $scope.chronology = [$scope.element]
        .concat(data["base.JSON"][$scope.element].children)
    }


    $scope.folder = $route.current.params.base
    let chronology = []
    $scope.element = $route.current.params.element

    if($scope.folder!="user"){
      Base.get($scope.folder).then(function(data){
        loadBase(data)
      })
    }
    else{
      Dialog.open("loadBase")
    }

    $scope.filterByCategory = () => (id) =>
        $scope.base[id].series.some( (category) =>
          $scope.categoryTick.array().find( (obj) => obj.title == category).checked
        )

    $scope.categoryTick = {
      array: () => Object.keys($scope.categories)
        .reduce( (arr,key) =>
          [...arr,...$scope.categories[key].series]
      ,[]),
      changeAll: function(array,checked){
        array.forEach(function(element){element.checked=checked})
      },
      checkAll: function(array,checked,primary){
        if(checked && array.every((obj)=>obj.checked)){
          primary.checked = true
        }
        else primary.checked = false
      },
      all: function(checked){
        this.changeAll(Object.values($scope.categories),checked)
        this.changeAll(this.array(),checked)
      },
      main: function(wave){
        this.changeAll(wave.series,wave.checked)
        this.checkAll(Object.values($scope.categories).slice(1),wave.checked,Object.values($scope.categories)[0])
      },
      secondary: function(wave,series){
        this.checkAll($scope.categories[wave.title].series,series.checked,wave)
        this.checkAll(Object.values($scope.categories).slice(1),wave.checked,Object.values($scope.categories)[0])
      }
    }

    $scope.dropdown_category = function(e,wave){
      var states = ["fa-arrow-down","fa-arrow-up"]
      var state = states.findIndex( (state)=>$(e.target).attr("class").includes(state))

      wave.open = !state
      $(e.target).removeClass(states[state]).addClass(states[~~!state])
    }

    $scope.showElement = function(id){
      $location.path($location.path()+"/"+id,false)
      $scope.element = id
      $scope.chronology = $scope.base[id].children ? [id].concat($scope.base[id].children) : [id]
    }
    $scope.hideElement = function(){
        $location.path($location.path().substr(1,$location.path().lastIndexOf("/")-1),false)
        $scope.element = false
        $scope.chronology = chronology;
    }

    $scope.dialog = Object.assign(Dialog,{
      loadUserBase: function(){
        if($scope.temp["base.JSON"] && $scope.temp["categories.JSON"] &&
           $scope.temp["chronology.JSON"]){
             loadBase($scope.temp)
             delete $scope.temp
           }
        else{
          delete $scope.temp
          Dialog.open('loadBaseError')
        }
      }
    })

    $scope.download = function(){
      Base.downloadInnerText("categories.JSON","categories.JSON")
    }

  })
