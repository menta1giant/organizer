let currentDate;

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const firstEntry = [2017, 1];

$('body').append("<div id='leftMenu'></div>");
$('#leftMenu').load('leftMenu.html', () => {
  console.log('Left Menu uploaded!');
  $('.menuObj_inst').eq(pageId).css('color', 'gold');
  try {
    eval(`diary${pageId}env()`);
  } catch (e) {
    console.log('no such function');
  }
});

function setTodaysDate() { // set today's date in format YYYYMM00
  let tday = new Date();
  tday = (tday.getFullYear() * 100 + tday.getMonth() + 1) * 100;
  currentDate = String(tday);
}

function appendDate() {
  const d = getVar();
  $('#leftMenu').append('<div id="date"><span class="navigator"><< </span><div></div><span class="navigator"> >></span></div>');
  $('#date span').click(function () {
    navigation($('#date span').index(this));
  });
  if (d) {
    setDate(d, 0);
    postInfo();
  } else {
    getNewDate();
  }
}

function getNewDate() {
  $.get('py/getNewDate.py', (data) => {
    console.log(data);
    setDate(String(data), 1);
    $('#date span:last-child').hide();
    // getTodo(currentDate);
    postInfo();
  });
}

function postInfo() {
  $.get('py/getTop.py', { d: currentDate }, (data) => {
    console.log(data);
    const rObj = JSON.parse(data);
    for (i = 0; i < 3; i++) {
      if (rObj[i][0]) {
        const current_field = $('.top_instance').eq(i);
        appendPerson(current_field, rObj[i][1], rObj[i][0]);
      }
    }
  });
  $.get('py/getDailies.py', { d: currentDate }, (data) => {
    console.log(data);
    const rObj = JSON.parse(data);
    for (k in Object.keys(rObj)) {
      vv = rObj[Object.keys(rObj)[k]];
      if (!vv) continue;
      const targetInput = $(`input[name=${Object.keys(rObj)[k].slice(1)}]`);
      $(targetInput).val(vv);
      if ($(targetInput).attr('type') == 'checkbox' && parseInt(vv) == 1) $(targetInput).prop('checked', true);
    }
  });
  getTodo(currentDate);
  $.get('py/getDiary.py', { d: currentDate }, (data) => {
    console.log(data);
    const cInfo = JSON.parse(data);
    $('textarea[name=Text1]').val(cInfo);
  });
}

function getTodo(d1) {
  $.get('py/getTodo.py', { d1 }, (data) => {
    console.log(data);
    const cInfo = JSON.parse(data);
    for (k = 0; k < 2; k++) {
      const cTable = $('.todo_table').eq(k);
      for (i = 0; i < 10; i++) {
        $(cTable).find('input').eq(i).val(cInfo[k][i]);
      }
    }
  });
}

function setDate(d, n) { // set new date from variable d, which can't exceed today's date
  const cD = [d.slice(6, 8), d.slice(4, 6), d.slice(0, 4)];
  const newDate = `${cD[0]}-${cD[1]}-${cD[2]}`;
  const dtchk = new Date(cD[2], cD[1] - 1, cD[0]);
  const tday = new Date();
  if (dtchk.getTime() > tday.getTime()) {
    window.history.go(-1); return false;
  }
  console.log(newDate);
  $('#date div').html(newDate);
  currentDate = d;
}

function navigation(whereTo) { // navigation through diary pages
  let wt = whereTo;
  if (!wt) wt = -1;
  $.get('py/navigationDate.py', { d: currentDate, ch: wt }, (data) => {
    document.location.href = `http://localhost/2_diary.html?d=${data}`;
  });
}

function showDetailedInfo(psId, pName) {
  currentPerson = psId;
  console.log(`Showing detailed info for person with ID ${currentPerson}`);
  $('#cover').show();
  $('#cover #s_name').text(pName);
  $.ajax(`/desc/desc_${psId}.txt`).done((cp_desc) => { // description
    $('#cover #s_desc').text(cp_desc);
  }).fail(() => {
    $('#cover #s_desc').text('No info');
  });
  $.get('py/getPtsById.py', { pId: psId }).done((d2) => { // total pts
    $('#cover #s_pts').text(d2);
  });
  $('#cover .photo_big').attr('src', `/photos/ph_${psId}.png`); // image source
  $(document).ready(() => {
    getGraphTopFromTo(currentPerson, currentDate.slice(0, 6) - 99, currentDate.slice(0, 6), 0, 'monthly_results');
  });
}

function formatDate(d, mode) {
  // 0 => YYYY
  // 2 => MM.YYYY
  // 4 => DD.MM
  // 6 => DD.MM.YYYY
  tempd = String(d);
  res = '';
  while (mode > 0) {
    res += `${tempd.slice(-2)}. `;
    tempd = tempd.slice(0, -2);
    mode -= 2;
  }
  res += tempd;
  console.log(`Formatted date: ${res}`);
  return res;
}

function appendGraph(e) {
  $.get('graph.html', (data) => {
    $(e).find('#graph_body').append(data);
  });
}
