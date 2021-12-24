// CALL FUNCTIONS

function getGraphTopFromTo(target, from, to, cy, mode) { // Towers for top
  const dataobj = {
    fit: 12, // how much can table fit
    margin: 5, // in px
    step: 1, // whether to support steps
    divisions: 5,
    elements: [],
  };
  $.get('py/getGraphTopFromTo.py', {
    target, from, to, cy, mode,
  }).done((data) => {
    // var parsed = JSON.parse(data);
    // console.log(data);
    for (d in data.data) {
      data.data[d][0] = formatDate(data.data[d][0], 2 + cy * (-2));
      data.data[d][1] = comma2digits(data.data[d][1]);
    }
    dataobj.elements = data.data;
    dataobj.ceiling = data.max;
    const gg = new Towers(dataobj);
    console.log(gg);
    gg.execute();
  });
}

function getGraphDailiesLinesFromTo(target, from, to, cy) { // Lines for dailies
  const dataobj = {
    fit: 12,
    margin: 5,
    step: 1,
    divisions: 5,
    ceiling: 0,
    fl: 0,
    elements: [],
  };
  $.get('py/getGraphTopFromTo.py', {
    target, from, to, cy, mode: 'dailies',
  }).done((data) => {
    // var parsed = JSON.parse(data);
    for (d in data.data) {
      data.data[d][0] = formatDate(data.data[d][0], 2 + cy * (-2));
      data.data[d][1] = comma2digits(data.data[d][1]);
    }
    dataobj.elements = data.data;
    const intervals = sortElemsToGetInterval(data.data);
    console.log(intervals);
    if (intervals[0] == intervals[1]) intervals[0] = 0.5 * intervals[1];
    console.log(intervals);
    dataobj.ceiling = intervals[1];
    dataobj.fl = intervals[0];
    console.log(data);
    const gg = new Lines(dataobj);
    console.log(gg);
    gg.execute();
  });
}

function getGraphDailiesCirclesFromTo(target, from, to, cy) { // Circles for dailies
  const dataobj = {
    fit: 12,
    margin: 10,
    step: 1,
    divisions: 10,
    ceiling: 1,
    palette: [104, 157, 117],
    elements: [],
  };
  $.get('py/getGraphTopFromTo.py', {
    target, from, to, cy, mode: 'dailies',
  }).done((data) => {
    // var parsed = JSON.parse(data);
    for (d in data.data) {
      data.data[d][0] = formatDate(data.data[d][0], 2 + cy * (-2));
      data.data[d][1] = comma2digits(data.data[d][1]);
    }
    // data['data'].reverse();
    dataobj.elements = data.data;
    console.log(data);
    const gg = new Circles(dataobj);
    console.log(gg);
    gg.execute();
  });
}

function getGraphTop14D(target) { // 14 days for top
  const dataobj = {
    fit: 7,
    margin: 10,
    step: 1,
    divisions: 10,
    ceiling: 3,
    palette: [104, 157, 117],
    elements: [],
  };
  $.get('py/getGraphTop14D.py', { target }).done((data) => {
    // var parsed = JSON.parse(data);
    for (d in data.data) {
      data.data[d][0] = formatDate(data.data[d][0], 4).slice(0, 6);
    }
    data.data.reverse();
    dataobj.elements = data.data;
    console.log(data);
    const gg = new Circles(dataobj);
    console.log(gg);
    gg.execute();
  });
}

function getDailiesCB14D(target) { // 14 days for checkboxes
  const dataobj = {
    fit: 7,
    margin: 10,
    step: 1,
    divisions: 10,
    ceiling: 1,
    palette: [104, 157, 117],
    elements: [],
  };
  $.get('py/selectLast30DailiesResults.py', { target }).done((data) => {
    // var parsed = JSON.parse(data);
    for (d in data.data) {
      data.data[d][0] = formatDate(data.data[d][0], 4).slice(0, 6);
    }
    data.data.reverse();
    dataobj.elements = data.data.slice(-14);
    console.log(data);
    const gg = new Circles(dataobj);
    console.log(gg);
    gg.execute();
  });
}

function selectLast30DailiesResults(target) { // Last 30 daily results
  const dataobj = {
    fit: 15,
    margin: 5,
    step: 1,
    divisions: 5,
    ceiling: 0,
    palette: [104, 157, 117],
    fl: 0,
    elements: [],
  };
  $.get('py/selectLast30DailiesResults.py', { target }).done((data) => {
    // var parsed = JSON.parse(data);
    for (d in data.data) {
      data.data[d][0] = formatDate(data.data[d][0], 4).slice(0, 6);
    }
    data.data.reverse();
    dataobj.elements = data.data;
    const intervals = sortElemsToGetInterval(data.data);
    if (!intervals[0]) intervals[0] = 0.5 * intervals[1];
    console.log(intervals);
    dataobj.ceiling = intervals[1];
    dataobj.fl = intervals[0];
    console.log(data);
    const gg = new Lines(dataobj);
    console.log(gg);
    gg.execute();
  });
}

// AUXILIARY FUNCTIONS

function setWMS(wd, marg) {
  $('.graph_main_margin').css('width', `${wd}px`);
  $('#graph_main').hScroll(wd + marg * 2); // You can pass (optionally) scrolling amount
  console.log(`Width: ${wd}`);
  console.log(`Total width: ${wd + marg * 2}`);
  $('.graph_main_margin').css('margin', `0px ${marg}px 0px ${marg}px`);
}

function sortElemsToGetInterval(elems) { // Get the minimum and the maximum values of set
  const newelems = elems.concat([]);
  newelems.sort(sortElems);
  let positiveValue = 0;
  while (positiveValue < newelems.length) {
    if (newelems[positiveValue][1]) break;
    positiveValue++;
  }
  console.log(`The first positive value is at position ${positiveValue}`);
  return [newelems[positiveValue][1], newelems[newelems.length - 1][1]];
}

function sortElems(a, b) {
  return a[1] - b[1];
}

function comma2digits(v) { // format number into NN,NN
  v = v.toFixed(2) * 100 / 100;
  return v;
}

function appendDataContainerToGraphTable() {
  $('#graph_table').append("<div class='graph_table_cont graph_main_margin'><div class='graph_table_cont_ceil'><span></span></div><div class='graph_table_cont_floor'></div></div>");
  $('#graph_desc').append("<div class='graph_main_margin'></div>");
  return $('.graph_table_cont').last();
}

function graphHoverEvents() { // events to display additional info on hover
  $('.graph_table_cont').mouseenter(function (e) {
    $(this).addClass('graph_table_cont_hover');
  });

  $('.graph_table_cont').mouseleave(function (e) {
    $(this).removeClass('graph_table_cont_hover');
  });
}

function radiusHover(r) { // radius expand on hover
  console.log(r);
  $('circle').mouseenter(function (e) {
    $(this).attr('r', String(r * 1.3));
    $('.graph_table_cont').eq($(this).attr('id')).addClass('graph_table_cont_hover');
  });
  $('circle').mouseleave(function (e) {
    $(this).attr('r', String(r));
    $('.graph_table_cont').eq($(this).attr('id')).removeClass('graph_table_cont_hover');
  });
}

// CLASSES

class Graph {
  constructor(data) {
    Object.keys(data).forEach((key, index) => { this[key] = data[key]; });
  }

  prep() {
    $('#graph_desc,#graph_table,#graph_vertical tbody').empty();
    $('#graph_vertical').css('opacity', '100');
    this.tableWidth = $('#graph_table').width() || 1092;
    this.fl = this.fl || 0;
    this.tableHeight = 260;
    console.log(`Table height: ${this.tableHeight}`);
    this.desiredElemWidth = Math.round(this.tableWidth / this.fit) - 2 * this.margin;
    console.log(`Desired element width: ${this.desiredElemWidth}`);
    this.maximumValue = Math.ceil(this.ceiling * 1.2); // Set maximum value
    this.fl = Math.floor(this.fl * 0.8); // Set minimum value
    if (this.divisions >= 10) this.maximumValue = this.desiredElemWidth;
    this.step = (Math.max(Math.ceil((this.maximumValue - this.fl) / (this.divisions * 2)) * this.step * 2));
  }

  eachCommon(el) { // do for every element in the dataset
    const newElement = appendDataContainerToGraphTable();
    const cel = this.elements[el];
    const env = [$(newElement).find('.graph_table_cont_ceil'), $(newElement).find('.graph_table_cont_floor')];
    $(newElement).find('span').html(cel[1]);
    $('#graph_desc div').eq(el).html(cel[0]);
    return { newElement, cel, env };
  }

  setDivisions() {
    for (let i = 0; i < this.divisions; i++) {
      const n = $('#graph_vertical tbody').append("<tr class='graph_vertical_inst'><td></td><td>—</td></tr>");
      $(n).find('td:nth-child(1)').last().html(comma2digits((this.step * (this.divisions - i) - this.step * 0.5) + this.fl));
    }
    $('.graph_vertical_inst').css('height', this.tableHeight / this.divisions);
    $('.graph_vertical_inst').css('line-height', `${this.tableHeight / this.divisions}px`);
  }

  setContParams(ec) {
    const filledpx = this.countFilledPx(ec.cel);
    $(ec.env[1]).css('height', `${filledpx}px`);
    $(ec.env[0]).css('height', `${this.tableHeight - filledpx}px`);
    return filledpx;
  }

  countFilledPx(cel) { // count filled px based on restrictions
    const filledpx = Math.round((cel[1] - this.fl) / (this.step * this.divisions) * this.tableHeight);
    return filledpx;
  }
}

class Circles extends Graph {
  execute() {
    super.prep();
    $('#graph_vertical').css('opacity', '0');
    for (const el in this.elements) {
      const ec = super.eachCommon(el);
      const diameter = this.desiredElemWidth - (this.ceiling + 1 - ec.cel[1]) * this.step * 1.5; // calculate diameter of circles
      $(ec.env[1]).css('height', `${diameter}px`);
      $(ec.env[1]).css('width', `${diameter}px`);
      const plt = comma2digits(0.2 + 0.8 * ec.cel[1] / this.ceiling); // calculate opacity step
      console.log(`Opacity step: ${plt}`);
      $(ec.env[1]).css('background', `rgb(${this.palette[0]},${this.palette[1]},${this.palette[2]},${plt})`);
      $(ec.env[0]).css('height', `${(this.tableHeight - diameter) / 2}px`);
      $(ec.env[1]).addClass('graph_table_circle');
    }
    setWMS(this.desiredElemWidth, this.margin);
    graphHoverEvents();
  }
}

class Towers extends Graph {
  execute() {
    super.prep();
    for (const el in this.elements) {
      const ec = super.eachCommon(el);
      super.setContParams(ec);
    }
    setWMS(this.desiredElemWidth, this.margin);
    super.setDivisions();
    graphHoverEvents();
  }
}

class Lines extends Graph {
  execute() {
    super.prep();
    const svg = $('<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:100%; height: 100%"></svg>').appendTo('#graph_table');
    $(svg).show();
    this.radius = Math.round(this.tableHeight / 50);
    while (!this.elements[0][1]) { // removing empty borders [1]
      this.elements.shift();
    }
    while (!this.elements[this.elements.length - 1][1]) { // [2]
      this.elements.pop();
    }
    console.log(this.elements);
    loop1: for (const el in this.elements) {
      const ec = super.eachCommon(el);
      const fpx = super.setContParams(ec);
      $(ec.env[1]).hide();
      if (!ec.cel[1]) {
        $('#graph_desc div').eq(el).html('');
        $('.graph_table_cont_ceil span').eq(el).html('');
        continue;
      }
      const s = this.margin + this.desiredElemWidth / 2; // variables for svg [1]
      const mp = 2 * this.margin + this.desiredElemWidth; // [2]
      const newCircle = $('<circle/>').appendTo(svg);
      $(newCircle).attr({
        cx: s + el * mp, cy: this.tableHeight - fpx, r: this.radius, id: el,
      });
      const ccc = parseInt(el);
      let tempCounter = Math.max(ccc - 1, 0);
      while (!this.elements[tempCounter][1]) { // variable to remove empty elements in the middle
        tempCounter -= 1;
        if (tempCounter < 0) continue loop1;
      }
      const previousElem = this.elements[tempCounter];
      const fpx2 = super.countFilledPx(previousElem);
      const newLine = $('<line stroke="black" stroke-width="2"/>').appendTo(svg);
      $(newLine).attr({
        x1: s + tempCounter * mp, x2: s + ccc * mp, y1: this.tableHeight - fpx2, y2: this.tableHeight - fpx,
      });
    }
    setWMS(this.desiredElemWidth, this.margin);
    super.setDivisions();
    $('svg').css('width', this.elements.length * (2 * this.margin + this.desiredElemWidth));
    const circles = $('circle');
    $('svg').children().remove(circles);
    $('svg').append(circles);
    $('#graph_table').html($('#graph_table').html());
    radiusHover(this.radius); // set radius for circles
  }
}
