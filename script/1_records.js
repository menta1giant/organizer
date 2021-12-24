let editMode = 0; // editing names
let movingMode = 0; // moving dailies between categories
let currentDailyId = 0; // daily that's being examined
setTodaysDate();

function addNewDailyToDOM(parentElem, name, val) {
  const dl = $("<div class='daily_body_inst'><div class='daily_body_inst_sq colored_bg'></div><span class='daily_body_inst_name'></span></div>").appendTo(parentElem);
  $(dl).find('.daily_body_inst_name').text(name);
  $(dl).attr('val', val);
  dragndrop($(dl));
}

$.get('py/getDailyCategories.py').done((data) => {
  console.log(data);
  for (cat in data) {
    $('#main').append("<div class='daily_category'><div class='daily_header'><div class='daily_header_line colored_bg'></div><span class='daily_header_name'></span></div></div>");
    const current_elem = $('#main').find('.daily_category:last-child');
    $(current_elem).find('.daily_header').attr('val', cat);
    $(current_elem).find('.daily_header_name').text(data[cat].name);
    const ce_ct = $("<div class='daily_body'></div>").appendTo(current_elem);
    for (d in data[cat].units) {
      addNewDailyToDOM(ce_ct, data[cat].units[d][1], data[cat].units[d][0]);
    }
  }

  const newDailyElem = $("<div class='daily_category dc_grey'><div class='daily_header' val='0'><div class='daily_header_line colored_bg'></div><span class='daily_header_name'>+ Add daily task</span></div><div class='daily_body'></div></div>").appendTo('#main');
  $(newDailyElem).click(() => {
    const newName = prompt('Name new daily task');
    if (newName) {
      $.post('py/createNewDaily.py', { name: newName }, (newId) => {
        addNewDailyToDOM($('.daily_body').eq(0), newName, newId);
      });
    }
  });

  $('.daily_header_name, .daily_body_inst_name').dblclick(function (e) { // unified edit for headers and common instances
    const t = $(this).is('.daily_header_name');
    const id = $(this).parents('.daily_body_inst, .daily_header').eq(0).attr('val');
    console.log(id);
    changeName(t, id, $(e.target));
  });

  $.get('py/getDailiesInfo.py').done((data) => { // add anchor information about daily
    console.log(data);
    for (daily in data) {
      const target = $(`.daily_body_inst[val=${data[daily].id}]`);
      if (data[daily].last) $(target).append(`<span class="d_info">Last: </span><span class="d_info">${data[daily].last}</span>`);
      if (data[daily].lm) $(target).append(`<span class="d_info">Avg. last month: </span><span class="d_info">${data[daily].lm.toFixed(2)}</span>`);
      if (data[daily].ly) $(target).append(`<span class="d_info">Avg. last year: </span><span class="d_info">${data[daily].ly.toFixed(2)}</span>`);
    }
  });

  const dbiInfo = $('<div id="daily_body_info"><div class="dbi_bestlmy"><span>Best Last Month</span><span></span><div class="dbi_desc"></div></div><div class="dbi_bestlmy"><span>Best Last Year</span><span></span><div class="dbi_desc">17.04.2019</div></div><div><div style="display:inline-block;vertical-align:top"><table id="top5cont"><caption>Top 5</caption><tbody></tbody></table></div><div id="graph_body"></div></div></div>');
  appendGraph(dbiInfo);
  $('.daily_header:not(.daily_header[val=3])').siblings().find('.daily_body_inst_name').click(function () {
    $(this).parent('.daily_body_inst').append(dbiInfo);
    loadDbiInfo($(this).parent('.daily_body_inst').eq(0).attr('val'), 3);
  });
  $('.daily_header[val=3]').siblings().find('.daily_body_inst_name').click(function () {
    $(this).parent('.daily_body_inst').append(dbiInfo);
    loadDbiInfo($(this).parent('.daily_body_inst').eq(0).attr('val'), 4);
  });
});

function loadDbiInfo(id, bi) {
  currentDailyId = id;
  $('.graph_buttons_inst').removeClass('graph_buttons_inst_shown');
  $(`.bi${bi}1`).addClass('graph_buttons_inst_shown');
  const t5b = $('#top5cont, .dbi_bestlmy');
  $(t5b).show();
  if (bi == 4) {
    $(t5b).hide();
    getGraphDailiesCirclesFromTo(currentDailyId, currentDate.slice(0, 6) - 100, currentDate.slice(0, 6) - 1, 0);
  }
  if (bi == 3) {
    $.get('py/getDailiesInfoBest.py', { daily: currentDailyId }).done((data) => {
      console.log(data);
      const tbl = $('#top5cont tbody');
      $(tbl).empty();
      for (result in data.top5) {
        $(tbl).append(`<tr><td>${formatDate(data.top5[result][0], 4)}</td><td>${data.top5[result][1]}</td></tr>`);
      }
      $('.dbi_bestlmy span:nth-child(2), .dbi_desc').text('');
      $('.dbi_bestlmy span:nth-child(2)').eq(0).text(data.bestm[1]);
      $('.dbi_desc').eq(0).text(formatDate(data.bestm[0], 4));
      $('.dbi_bestlmy span:nth-child(2)').eq(1).text(data.besty[1]);
      $('.dbi_desc').eq(1).text(formatDate(data.besty[0], 4));
      $('.dbi_bestlmy span:nth-child(2)').mouseenter(function () {
        $(this).siblings('.dbi_desc').css('opacity', 1);
      });
      $('.dbi_bestlmy span:nth-child(2)').mouseleave(function () {
        $(this).siblings('.dbi_desc').css('opacity', 0);
      });

      getGraphDailiesLinesFromTo(currentDailyId, currentDate.slice(0, 6) - 100, currentDate.slice(0, 6) - 1, 0);
    });
  }
}

function dragndrop(targetElem) {
  const toMove = targetElem;
  $(toMove).mousedown(function (e) { // 1. отследить нажатие
    if (!movingMode) return;
    const shiftX = e.clientX - $(toMove)[0].getBoundingClientRect().left;
    const shiftY = e.clientY - $(toMove)[0].getBoundingClientRect().top;
    // подготовить к перемещению
    // 2. разместить на том же месте, но в абсолютных координатах
    $(toMove).addClass('daily_body_inst_drag');
    $('body').append(this);
    moveAt($(toMove), e.pageX, e.pageY);
    function moveAt(elem, pageX, pageY) {
      console.log([pageX, pageY]);
      $(elem).css('left', `${pageX - shiftX}px`);
      $(elem).css('top', `${pageY - shiftY}px`);
    }

    function onMouseMove(event) {
      moveAt($(toMove), event.pageX, event.pageY);
    }

    // (3) перемещать по экрану
    $(document).bind('mousemove', onMouseMove);

    function justBind() {
      $(document).unbind('mousemove', onMouseMove);
      $(toMove).unbind('mouseup', justBind);
      const h_crds = [];
      console.log(`MOUSE UP for${$(toMove).find('.daily_body_inst_name').text()}`);
      $('.daily_header').each(function (i) { // Calculate new parent and append element
        if ((i + 1) == $('.daily_header').length || ($(toMove)[0].getBoundingClientRect().top) <= $('.daily_header').eq(i + 1)[0].getBoundingClientRect().top) {
          $(toMove).removeClass('daily_body_inst_drag');
          $(this).siblings('.daily_body').append(toMove);
          console.log($(toMove).attr('val'));
          console.log($(toMove).parent().siblings('.daily_header').eq(0)
            .attr('val'));
          moveDailyCategories($(toMove).attr('val'), $(toMove).parent().siblings('.daily_header').eq(0)
            .attr('val'));
          return false;
        }
      });
    }
    // (4) положить, удалить более ненужные обработчики событий
    $(toMove).bind('mouseup', justBind);
  });
  $(toMove).on('dragstart', () => false);
}

function moveDailyCategories(target, moveto) { // transfer daily between categories
  console.log(`TARGET: ${target} MOVETO: ${moveto}`);
  if (moveto == '0') {
    const todel = $(`.daily_body_inst[val=${target}]`);
    if (confirm(`Are you sure about moving ${target} to ${moveto}?`)) {
      $(todel).remove();
    } else {
      moveDailyCategories(target, 1);
      $('.daily_body').eq(0).append(todel);
      return;
    }
  }
  $.post('py/moveDailyCategories.py', { target, moveto }, (data) => {
    console.log(data);
  });
}

function changeName(t, id, el) {
  el = $(el).parents('.daily_body_inst, .daily_header').eq(0).find('.daily_header_name, .daily_body_inst_name')
    .eq(0);
  console.log(editMode);
  if (editMode) {
    var v = $(el).find('input').val();
    $(el).html(v);
    console.log('Is it a header?');
    console.log(t);
    const tbl = t ? 'daily_cat' : 'daily';
    $.post('py/changeDailyName.py', { table: tbl, id, name: v }, (data) => {
      console.log(data);
    });
  } else {
    var v = $(el).html();
    $(el).html(`<input spellcheck="false" maxlength="20" name="objectName" type="text" value="${v}"/>`);
  }
  editMode = !editMode;
}

function setMovingMode() {
  $('#moveButton_checkbox').toggleClass('moveButton_checkbox_checked');
  movingMode = !movingMode;
}
