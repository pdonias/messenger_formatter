
chrome.storage.sync.get({
	codeTags: true,
	italicsTags: true,
	boldTags: true,
	strikeTags: true
}, function(enabled) {
	codeTags = enabled.codeTags;
	italicTags = enabled.italicsTags;
	boldTags = enabled.boldTags;
	strikeTags = enabled.strikeTags;
});

if (window.MutationObserver) {
	var observer = new MutationObserver(function (mutations) {
		Array.prototype.forEach.call(mutations, function (m) {
			if (m.type === 'childList') {
				walk(m.target);
			} else if (m.target.nodeType === 3) {
				handleText(m.target);
			}
		});
	});

	observer.observe(document.body, {
		childList: true,
		attributes: false,
		characterData: true,
		subtree: true
	});
}

function walk(node)
{
	// I stole this function from here:
	// http://is.gd/mwZp7E

	var child, next;

	switch ( node.nodeType )
	{
		case 1:  // Element
		case 9:  // Document
		case 11: // Document fragment
			child = node.firstChild;
			while ( child )
			{
				next = child.nextSibling;
				walk(child);
				child = next;
			}
			break;

		case 3: // Text node
			handleText(node);
			break;
	}
}

function fetchGIFID(request){
	var image_id = null;

	$.ajax({
	  url: request,
		async: false,
	  success: function(result){
			image_id = result['data'][0]['id'];
		}
	});

	return image_id;
}

function handleText(textNode)
{
	if (textNode.parentElement.tagName.toLowerCase() === "script" || textNode.parentElement.isContentEditable === true) {
		return false;
	}

	var oldValue = textNode.nodeValue.replace("<", "&lt;").replace(">", "&gt;");
	var newTags = oldValue;
	if(codeTags) newTags = oldValue.replace(/([^`]*)[^`]?`\h*([^`(\r\n?)\n]+?)\h*`([^`]*)/ig, "$1 <code class=\"cd-ext\"> $2 </code> $3");

	if(newTags == oldValue && (italicTags || boldTags || strikeTags)){	//if not code, do italics and bold and strike-through
		if(italicTags) newTags = oldValue.replace(/(?:([^_]*\s)_|^_)(\S[^_]*\S)(?:_$|_([^a-z0-9][^_]*))/ig, "$1<i>$2</i>$3");
		if(boldTags) newTags = newTags.replace(/(?:([^\*]*\s)\*|^\*)(\S[^\*]*\S)(?:\*$|\*([^a-z0-9][^\*]*))/ig, "$1<b>$2</b>$3");
		if(strikeTags) newTags = newTags.replace(/(?:([^~]*\s)~|^~)(\S[^~]*\S)(?:~$|~([^a-z0-9][^~]*))/ig, "$1<s>$2</s>$3");
	}
  if(newTags != oldValue){
    var newNode = document.createElement('span');
    var nodes = $.parseHTML(newTags);
    var arrayLength = nodes.length;
    for (var i = 0; i < arrayLength; i++) {
      newNode.appendChild(nodes[i]);
    }
    textNode.parentNode.insertBefore(newNode, textNode);
    textNode.parentNode.removeChild(textNode);
  }
}
