let editMode = 0;

function enableEditMode() {
  const sName = $('#s_name').html();
  const sDesc = $('#s_desc').html();
  $('#s_name').html(`<input type="text" name ="sNameInput" value="${sName}"/>`);
  $('#s_desc').html(`<textarea name="sDescInput" spellcheck="false">${sDesc}</textarea>`);
}

function exitEditMode() {
  const sName = $('#s_name input').eq(0).val();
  const sDesc = $('#s_desc textarea').val();
  $('#s_name').html(sName);
  $('#s_desc').html(sDesc);
  const formData = new FormData();
  formData.append('sDescInput', sDesc);
  formData.append('sNameInput', sName);
  formData.append('pId', currentPerson);
  for (const p of formData) {
    console.log(p);
  }
  $.ajax({
    url: 'py/updatePersonInfo.py',
    type: 'POST',
    data: formData,
    success(msg) {
      console.log('Update successful!');
    },
    error(msg) {
      alert('Ошибка!');
    },
    contentType: false,
    processData: false,
  });
}

$.get('cover.html', (data) => {
  $('body').append(data);
  $('#coverUploadPhoto').change(function (e) {
    const formData = new FormData();
    formData.append('userfile', $(this)[0].files[0], `ph_${currentPerson}.png`);
    readURL(this);
    console.log(formData);
    $.ajax({
      url: 'py/uploadPhotoToDB.py',
      type: 'POST',
      data: formData,
      success(msg) {
        // alert(msg);
      },
      error(msg) {
        alert('Error!');
      },
      cache: false,
      contentType: false,
      processData: false,
    });
    e.preventDefault();
  });
  $('#cover').click((event) => {
    if (!$(event.target).closest('#cover_info').length) {
      if (editMode) alert('Editing mode on!');
      else {
        $('#cover').hide();
      }
    }
  });
  $('.csb_inst').click(function () {
    $(this).toggleClass('csb_inst_selected');
    editMode = Math.abs(editMode - 1);
    console.log(editMode);
    if (editMode) enableEditMode();
    else exitEditMode();
  });
  appendGraph($('#cover'));
});

function readURL(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      $('.photo_big').attr('src', e.target.result);
    };

    reader.readAsDataURL(input.files[0]); // convert to base64 string
  }
}
