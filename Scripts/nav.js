$(document).ready(function(){

//NavBar

  $(".navBar ul.left > li").on('click', function(){
    if ( $(this).hasClass('active') ){
      $(this).removeClass('active')
      $(this).children().removeClass('active')
    }
    else{
      $(this).siblings().removeClass('active')
      $(this).siblings().children().removeClass('active')
      $(this).addClass('active')
      $(this).children('ul').addClass('active')
    }
  })

});