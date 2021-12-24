function markPickedMenuElem(et) { // highlight chosen menu element
  console.log('Marking picked menu elements!');
  $(et).addClass('tmenu_inst_picked');
  $(et).siblings().removeClass('tmenu_inst_picked');
}

function getTopInterval(d1, d2, et, fcp, cy) {
  console.log(`Getting top in interval from ${d1} to ${d2}`);
  $.get('py/getTopInterval.py', { d1, d2 }).done((data) => {
    $('#top_table tbody, #top_menu_roll_body').empty();
    markPickedMenuElem(et);
    console.log('Fill choice positions?');
    console.log(fcp);
    if (fcp) { // if side menu with interval choices is needed, append itremakeTop
      fillChoicePositions(cy);
    }
    console.log('Received data:');
    console.log(data);
    const topInterval = data;
    const sortable = [];
    for (person in topInterval) {
      sortable.push([person, topInterval[person][0], topInterval[person][1]]);
    }
    sortable.sort((a, b) => // sort by pts
      b[1] - a[1]);
    for (i in sortable) { // append people one by one
      appendPersonTop(sortable[i]);
    }
    $('tr').click(function () {
      opElem = $(this).find('td').eq(0);
      const ceVal = $(opElem).attr('val');
      showDetailedInfo(ceVal, topInterval[ceVal][1]);
    });
  });
}

function appendPersonTop(dataArr) {
  $('#top_table tbody').append(`<tr><td val=${dataArr[0]}>${dataArr[2].toUpperCase()}</td><td>${dataArr[1]}</td></tr>`);
}

function setMaximumValue() { // if it's needed, setting both options equal to the 1st, and if it's chosen, making the 2nd one invisible
  if (compareWithEOne(parseInt(tmrhpick[1].attr('optionId')))) {
    tmrhpick[1].html(tmrhpick[0].html());
    tmrhpick[1].attr('optionId', tmrhpick[0].attr('optionId'));
    requestData[1] = requestData[0];
    if (selectedChoice == 0) tmrhpick[1].addClass('tmr_hpick_inv');
  }
}

function compareWithEOne(elemId) { // check whether picked element is lesser than the value of the 1st option
  return elemId < parseInt(tmrhpick[0].attr('optionId'));
}

function remakeTop(e, cy) { // constructing new table based on request data
  const tId = $(e.target).attr('id');
  requestData[selectedChoice] = tId;
  if ((selectedChoice + multipleChoice) == 0) {
    requestData[1] = tId;
    $('.tmr_hpick').attr('optionId', tId);
    $('.tmr_hpick').html($(e.target).html());
  } else {
    $('.tmr_hpick_selected').attr('optionId', tId);
    $('.tmr_hpick_selected').html($(e.target).html());
  }
  setMaximumValue();
  console.log(requestData);
  getTopInterval(requestData[0], requestData[1], e.target, true, cy);
}

function fillChoicePositions(countingYears) {
  for (i = firstEntry[0]; i <= cd[0]; i++) {
    if (countingYears) {
      $('#top_menu_roll_body').append(`<div class="tmr_bInst" id=${i}>${i}</div>`);
    } else {
      for (k = 0; k < 12; k++) {
        if (i == firstEntry[0] && k < firstEntry[1]) {
          continue;
        }
        if (i == cd[0] && k >= cd[1]) break;
        $('#top_menu_roll_body').append(`<div class="tmr_bInst" id=${i * 100 + k + 1}>${monthNames[k]} ${i}</div>`);
      }
    }
  }
  $('#top_menu_roll').children().show();
  $('.tmr_bInst').click((e) => {
    remakeTop(e, countingYears);
  });
}

setTodaysDate();
console.log(`Today's date set: ${currentDate}`);
let multipleChoice; // Boolean: whether the selection is an interval
let selectedChoice; // Boolean: whether
var cd = [parseInt(currentDate.slice(0, 4)), parseInt(currentDate.slice(4, 6))];
const ym = cd[0] * 100 + cd[1];
$('.tmenu_inst').eq(0).html(monthNames[cd[1] - 1]);
$('.tmenu_inst').eq(1).html(cd[0]);
var requestData = [ym, ym];
$('.tmr_hpick').attr('optionId', ym);
getTopInterval(requestData[0], requestData[1], 0, false); // request top for current month
var tmrhpick = [$('.tmr_hpick').eq(0), $('.tmr_hpick').eq(1)];

$('.tmenu_inst').not(':eq(2)').click((event) => {
  $('#top_menu_roll_head .tmr_hpick').eq(0).addClass('tmr_hpick_selected');
  $(tmrhpick[1]).addClass('tmr_hpick_inv');
  multipleChoice = 0;
  selectedChoice = 0;
  const countingYears = Boolean($(event.target).html() == $('.tmenu_inst').eq(1).html()); // check if the 2nd button is pressed
  if (countingYears) {
    $('.tmr_hpick').html(cd[0]);
    getTopInterval(cd[0], cd[0], event.target, true, countingYears);
  } else {
    $('.tmr_hpick').html(`${monthNames[cd[1] - 1]} ${cd[0]}`);
    getTopInterval(ym, ym, event.target, true, countingYears);
  }
  console.log('Are we counting years?');
  console.log(countingYears);
});

$('.tmenu_inst').eq(2).click((event) => { getTopInterval(firstEntry[0] * 100 + firstEntry[1] + 1, ym, event.target, false); $('#top_menu_roll').children().hide(); });

$('#top_menu_roll_head .tmr_hpick').click((event) => { // highlight selected part of interval
  $(event.target).addClass('tmr_hpick_selected');
  $(event.target).siblings().removeClass('tmr_hpick_selected');
});

tmrhpick[1].click(function (event) {
  $(this).removeClass('tmr_hpick_inv');
  multipleChoice = 1;
  selectedChoice = 1;
  $('.tmr_bInst').each(function () {
    if (compareWithEOne(parseInt($(this).attr('id')))) {
      $(this).addClass('tmr_bInst_hidden');
    }
  });
});

tmrhpick[0].click((event) => {
  selectedChoice = 0;
  $('.tmr_bInst_hidden').removeClass('tmr_bInst_hidden');
});
