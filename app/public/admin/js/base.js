/* eslint-disable no-unused-vars */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-undef */
// eslint-disable-next-line strict
$(function() {

  $('.aside h4').click(function() {
    //		$(this).toggleClass('active')
    $(this).siblings('ul').slideToggle();
  });

  // iframe框架高度
  $('#rightMain').height($(window).height() - 100);
  $(window).resize(function() {
    $('#rightMain').height($(window).height() - 100);
  });
});

function changeStatus(ele, model, attr, _id) {
  $.get('/admin/changeStatus', {
    model,
    attr,
    _id,
  }, function(data) {
    if (data.success === 'true') {
      if ($(ele).text() === '启用') {
        $(ele).text('禁用');
      } else {
        $(ele).text('启用');
      }
    }
  });
}

function changeAttr(ele, model, attr, _id) {
  if ($(ele).find('input').length > 0) {
    return false;
  }
  const oldValue = $(ele).text();
  $(ele).html('<input type="text" value="" />');
  const inputObj = $(ele).find('input');
  inputObj.focus().val(oldValue);
  inputObj.blur(function() {
    const val = $(this).val();
    $.get('/admin/changeAttr', {
      model,
      attr,
      _id,
      val,
    }, function(data) {
      if (data.success === 'true') {
        $(ele).text(val);
        // eslint-disable-next-line no-alert
        alert('修改成功！');
      }
    });
  });

}
