// Load styles if JavaScript is available
if (document.createElement) {
	var link = document.createElement('link');
	link.setAttribute('rel', 'stylesheet');
	link.setAttribute('type','text/css');
	link.setAttribute('href','js.css');
	document.getElementsByTagName('head')[0].appendChild(link);
} else {
	document.write("<link type='text/css' rel='stylesheet' href='js.css' />");
}