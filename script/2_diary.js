let todoToggle = 0;
let tomorrowDate;
let currentPerson = 0;

function diary2env() { // INITIALIZATION FUNCTION
  appendDate();
  $('#leftMenu').append('<div id="confirm">SAVE</div>');
  $('#confirm').click(confirmChanges); // Record changes
}

$.get('py/getDailyCategories.py').done((data) => {
  console.log(data);
  for (cat in data) {
    $('#dailies_container').append("<div class='daily'><div class='daily_head'></div></div>");
    const currentElem = $('#dailies_container').find('.daily:last-child');
    $(currentElem).find('.daily_head').attr('val', cat);
    $(currentElem).find('.daily_head').text(data[cat].name);
    for (d in data[cat].units) {
      $(currentElem).append("<div class='daily_inst'></div>");
      const ce_ct = $(currentElem).find('.daily_inst:last-child');
      $(ce_ct).append("<div class='daily_inst_name'></div><div class='daily_inst_score'><input type=text></div>");
      $(ce_ct).find('.daily_inst_name').text(data[cat].units[d][1]);
      $(ce_ct).find('input').attr('name', data[cat].units[d][0]);
    }
    if (data[cat].checkbox) {
      $(currentElem).find('input').attr('type', 'checkbox');
      $(currentElem).find('.daily_inst_score').css('border-width', 0);
    }
  }

  $('.daily_inst input').focusin(function () { // Focus on selected daily [1]
    $(this).closest('.daily_inst').children('div').toggleClass('focused');
  });

  $('.daily_inst input').focusout(function () { // [2]
    $(this).closest('.daily_inst').children('div').toggleClass('focused');
  });

  $('.daily_head').click(function () {
    $('.daily_inst').hide();
    $('.daily_head').removeClass('daily_head_clicked');
    $(this).siblings('.daily_inst').show();
    $(this).addClass('daily_head_clicked');
  });
});

$('.toggler').click(function () {
  if (!$(this).children('.toggler_overlay').length) return;
  let currentValue = $('.toggler_overlay').css('left');
  currentValue = parseInt(currentValue[0]);
  console.log(`Toggler left: ${currentValue}`);
  currentValue = Math.abs(Math.round(currentValue / (currentValue + 1)) * 50 - 50);
  $('.toggler_overlay').css('left', `${currentValue}%`);
  $('.todo_table').eq(todoToggle).hide();
  todoToggle = (todoToggle + 1) % 2;
  $('.todo_table').eq(todoToggle).show();
});

$('.top_input input').on('input', function () {
  current_value = $(this).val();
  const current_field = $(this).closest('.top_instance');
  console.log(current_value);
  $.get('py/searchPeopleDB5.py', { string: current_value }).done((data) => {
    $('.top_choice').hide();
    $(current_field).find('.top_choice').show();
    console.log('Top 5 suggestions');
    console.log(data);
    $(current_field).find('.top_choice').empty();
    if (!current_value) {
      $(current_field).find('.top_choice').hide();
      return;
    }
    if (!data.length) {
      $(current_field).find('.top_choice').append('<div class="top_choice_inst">Не найдено</div>');
      current_option = $('.top_choice_inst:last-child');
      $(current_option).css('font-style', 'italic');
      $(current_option).attr('val', '0');
      return;
    }
    for (person in data) {
      $(current_field).find('.top_choice').append('<div class="top_choice_inst"></div>');
      current_option = $('.top_choice_inst:last-child');
      $(current_option).text(data[person].name);
      $(current_option).attr('val', data[person].id);
    }
    $('.top_choice_inst').click(function () {
      const current_person = [$(this).attr('val'), $(this).text()];
      $(current_field).find('.top_input, .top_choice').hide();
      appendPerson(current_field, current_person[1], current_person[0]);
    });
  });
});

function postTodaysTop() {
  $.get('py/getTop.py', { d: currentDate }).done((data) => {
    const d = JSON.parse(data);
    for (person in d) {
      appendPerson($('.top_instance').eq(person), d[person][1], d[person][0]);
    }
  });
}

function confirmChanges() {
  if ($('#top_container .top_box').length != 3) { // whether all boxes are filled with existing people
    $('#top_container .top_input input').filter(function () {
      return this.value;
    }).addClass('newPerson');
    if ($('.newPerson').length) {
      if (!confirm('Continue with new ppl?')) {
        $('.newPerson').removeClass('newPerson');
        return;
      }
    }
  }
  let top3 = [];
  for (i = 0; i < 3; i++) {
    top3[i] = $('.top_instance').eq(i).find('.top_box').attr('val');
    if (!top3[i]) top3[i] = $('.top_instance').eq(i).find('input').val();
  }
  top3 = JSON.stringify(top3);
  console.log({ top3, d: currentDate });
  let res = processForm(); // from getVar.js
  console.log('Form:');
  console.log(res);
  $('.daily input').each(function (index) {
    if (!(res.hasOwnProperty($(this).attr('name')))) { // helps with unchecked checkboxes
      res[$(this).attr('name')] = '0';
    }
  });
  res = JSON.stringify(res);

  $.ajax({
    url: 'py/updateTop.py',
    data: { top3, d: currentDate },
    success(data) {
      console.log(data);
      $.post('py/updateDailies.py', { res, d: currentDate }, (data) => { // for continuance reasons
        console.log(data);
      });
    },
  });

  const diaryText = JSON.stringify($('textarea[name=Text1]').val());
  console.log('Diary text:');
  console.log(diaryText);
  $.ajax({
    url: 'py/writeDiary.py',
    data: { data0: diaryText, d: currentDate },
    success(data) {
      console.log(data);
    },
  });

  const todoArr = [];
  for (k = 0; k < 2; k++) { // TODO for today and tomorrow
    const cTable = $('.todo_table').eq(k);
    const cArr = [];
    for (i = 0; i < 10; i++) {
      cArr.push($(cTable).find('input').eq(i).val());
    }
    todoArr.push(JSON.stringify(cArr));
  }
  console.log('Todo:');
  console.log(todoArr);
  $.ajax({
    url: 'py/writeTodo.py',
    data: { data1: todoArr[0], data2: todoArr[1], d1: currentDate },
    success(data) {
      // console.log(data);
    },
  });
}

function appendPerson(parent, name, id) {
  $(parent).append("<div class='top_box'><img class='top_img image'/><span></span><div class='top_x'>x</div></div>");
  nameFolder = $(parent).find('.top_box span');
  $(nameFolder).text(name);
  if (name.length > 18) nameFolder.css('font-size', 25 - (name.length - 18)); // change font size according to name length
  $(parent).find('.top_box').attr('val', id);
  $(parent).find('.top_box .top_img').attr('src', `/photos/ph_${id}.png`);
  $(parent).find('.top_x').click(() => {
    $(parent).find('.top_box').remove();
    $(parent).find('.top_input').show();
  });
  $(parent).find('.top_box').click(() => {
    showDetailedInfo(id, name);
  });
}
