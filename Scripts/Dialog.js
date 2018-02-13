angular
  .module('app')
  .factory('Dialog',function(){
    return {

      template: undefined,
      params: undefined,

      exit: function(func){
        this.template = undefined
        if(func)this[func](...this.params)
      },

      open: function(template,params){
        this.template = template
        this.params = params
      }

    }
  })
