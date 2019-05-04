// eslint-disable-next-line strict
$(function() {

  $('.aside h4').click(function() {
    //		$(this).toggleClass('active')
    $(this).siblings('ul').slideToggle();
  });
});

function changeStatus(ele, model, attr, _id) {
  $.get('/admin/changeStatus', { model, attr, _id }, function(data) {
	  if (data.success === 'true') {
      if ($(ele).text() === '启用') {
        $(ele).text('禁用');
      } else{
        $(ele).text('启用');
      }
	  }
  });
}
