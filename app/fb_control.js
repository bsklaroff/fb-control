var remove = function() {
  try {
    document.getElementById('pagelet_home_stream').innerHTML = '';
  } catch (err) {
    // do nothing if element not found
  }
  setTimeout(remove, 1000);
}
remove();
