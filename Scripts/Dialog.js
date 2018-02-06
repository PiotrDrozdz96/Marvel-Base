angular
  .module('app')
  .factory('Dialog',function(){
    return {

      template: undefined,
      params: undefined,

      exit: function(func){
        $(".additional_layout").removeClass("on")
        if(func)this[func](...this.params)
      },

      open: function(template,params){
        this.template = template
        this.params = params
        $(".additional_layout").addClass("on")
      }

    }
  })
