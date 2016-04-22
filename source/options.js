// Saves options to chrome.storage
function save_options() {
  var codeChecked = document.getElementById('code').checked;
  var italicsChecked = document.getElementById('italics').checked;
  var boldChecked = document.getElementById('bold').checked;
  var strikeChecked = document.getElementById('strike').checked;

  chrome.storage.sync.set({
    codeTags: codeChecked,
    italicsTags: italicsChecked,
    boldTags: boldChecked,
    strikeTags: strikeChecked
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function restore_options() {
  //all enabled by default
  chrome.storage.sync.get({
    codeTags: true,
    italicsTags: true,
    boldTags: true,
    strikeTags: true
  }, function(enabled) {
    document.getElementById('code').checked = enabled.codeTags;
    document.getElementById('italics').checked = enabled.italicsTags;
    document.getElementById('bold').checked = enabled.boldTags;
    document.getElementById('strike').checked = enabled.strikeTags;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);