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
      $scope.categories = Base.convertCategories(data["categories.JSON"])
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
      Base.getAll($scope.folder).then(function(data){
        loadBase(data)
      })
    }
    else{
      Dialog.open("loadBase")
    }

    $scope.filterByCategory = function (categories) {
      return function(id){
        return $scope.base[id].series.some( (category) => categories[category].checked)
      }
    };

  //CategoryFunctions
    $scope.categoryTick = function(e){

      let category = () => $scope.categories[e.target.id]

      function checkAll(arrayId,parentId){
        if (category().checked && (arrayId)
            .map((categoryId) => $scope.categories[categoryId].checked)
              .every( (check) => check) ){
                $scope.categories[parentId].checked=true;
              }
        else $scope.categories[parentId].checked=false
      }

      function changeAll(arrayId,value){
        $.each(arrayId,function(index,category){
          $scope.categories[category].checked = value
        })
      }

      switch(category().type){
        case "all":
          changeAll(Object.keys($scope.categories),category().checked)
          break;
        case "main":
          changeAll(category().children,category().checked)
          checkAll(Object.keys($scope.categories).slice(1,-1),"all");
          break;
        case "secondary":
        case "secondary on":
          checkAll($scope.categories[category().parent].children,category().parent)
          checkAll(Object.keys($scope.categories).slice(1,-1),"all");
          break;
        default:
      }
    }

    $scope.dropdown_category = function(e,element){
      var states = ["fa-arrow-down","fa-arrow-up"]
      var state = states.findIndex( (state)=>$(e.target).attr("class").includes(state))

      element.children.forEach(function(id){
        $scope.categories[id].type= state ? "secondary" : "secondary on"
      })

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

  })
