function getVar() { // GET variables
  const $_GET = {};
  if (document.location.toString().indexOf('?') !== -1) {
    const query = document.location
      .toString()
    // get the query string
      .replace(/^.*?\?/, '')
    // and remove any existing hash string (thanks, @vrijdenker)
      .replace(/#.*$/, '')
      .split('&');

    for (let i = 0, l = query.length; i < l; i++) {
      const aux = decodeURIComponent(query[i]).split('=');
      $_GET[aux[0]] = aux[1];
    }
  }
  // get the 'index' query parameter
  return $_GET.d;
}

function processForm(cur) {
  const formOutput = $('form').eq(0).serializeArray().reduce((obj, item) => {
    obj[item.name] = item.value;
    if (item.value == 'on') obj[item.name] = '1';
    return obj;
  }, {});
  console.log(formOutput);
  return formOutput;
}
