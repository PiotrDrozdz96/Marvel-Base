angular
  .module('app')
  .factory('Dialog',function(){
    return {

      template: undefined,
      params: undefined,

      exit: function(func,additionalParams){
        this.template = undefined
        if(func){
          if(additionalParams) this[func](...this.params,...additionalParams)
          else this[func](...this.params)
        }
      },

      open: function(template,params){
        this.template = template
        if(params) this.params = params
      }

    }
  })
