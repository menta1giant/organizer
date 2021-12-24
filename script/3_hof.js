let hf_inst = ''; // template

$(document).ready(()
=> {
  $.get('hf_inst.html', (html_string)
   => {
      hf_inst = html_string;
      $.get('py/getHallOfFame.py').done(( data )=> {
          console.log(data);
            for (pers in data) {
                console.log(pers);
                let currentPers = $(hf_inst).clone().appendTo('#hf_container');
                $(currentPers).find('span').text(data[pers][5]);
                for (i = 0; i < 3; i++) {
                    $(currentPers).find('.hfm_count').eq(i).text(data[pers][i + 1]);
        }
                $(currentPers).find('.hf_photo').attr('src', "/photos/ph_" + data[pers][0] + '.png');
            }
        });
    $('#hf_container').hScroll(40);
  }, 'html');
});
