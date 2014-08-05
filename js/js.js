	function initMedia()
	{
		var anchors = document.getElementsByTagName('a');
		for (var i=0; i<anchors.length; i++){
			var anchor = anchors[i];
			var relAttribute = String(anchor.getAttribute('rel'));
			if (anchor.getAttribute('href') && (relAttribute.toLowerCase().match('mediavideo')))
			{
				var mediaSrc = anchor.href.split('watch?v=',2)[0]+'/embed/'+anchor.href.split('watch?v=',2)[1];
				var mediaTitle = anchor.title;
				anchor.onclick = function () {showVideo(mediaSrc,mediaTitle);return false;}
				anchor.removeAttribute('href');
			}
			if (anchor.getAttribute('href') && (relAttribute.toLowerCase().match('mediaphoto')))
			{
				photoQueue.push(anchor.href);
				var queuePos = photoQueue.length;
				anchor.rel = queuePos;
				anchor.onclick = function () {showPhoto(this);}
				anchor.removeAttribute('href');
			}
		}
	}
	function showPhoto(photo)
	{
		if (photoQueue==undefined)
		{
			return;
		}		
		openMedia();
		var photoFrame = new Image();
		photoFrame.onload = function(){photoFrame.style.visibility = 'visible';}
		photoFrame.src = photoQueue[photo.rel-1];
		if (contentBox==undefined)
		{
			var contentBox = document.getElementById('content-box');
		}
		contentBox.appendChild(photoFrame);
		document.getElementById('mediaTitle').innerHTML = 'Фотография '+photo.rel+' из '+photoQueue.length;

	}
	function showVideo(src,title)
	{
		openMedia();
		msgbox.setAttribute( 'class', 'mediaVideo' );
		var videoFrame = document.createElement("iframe");
		videoFrame.frameBorder="0";
		videoFrame.width = 720;
		videoFrame.height = 410;
		videoFrame.src = src+'?showinfo=0';
		if (contentBox==undefined)
		{
			var contentBox = document.getElementById('content-box');
		}
		contentBox.appendChild(videoFrame);
		document.getElementById('mediaTitle').innerHTML = title;
	}
	function openMedia()
	{
		if (overlay==undefined)
		{
			var overlay = document.getElementById('overlay');
		}
		if (body==undefined)
		{
			var body = document.getElementsByTagName("body")[0];
		}
		if (contentBox==undefined)
		{
			var contentBox = document.getElementById('content-box');
		}
		var msgbox = document.getElementById('msgbox');
		overlay.setAttribute( 'class', 'show' );
		overlay.style.overflowY = 'scroll';
		body.style.overflow = 'hidden';
	}
	//video 720x410 top40px lr30px bot45px
	function closeMedia()
	{
		if (overlay==undefined)
		{
			var overlay = document.getElementById('overlay');
		}
		if (body==undefined)
		{
			var body = document.getElementsByTagName("body")[0];
		}
		if (contentBox==undefined)
		{
			var contentBox = document.getElementById('content-box');
		}
		if (msgbox==undefined)
		{
			var msgbox = document.getElementById('msgbox');
		}
		body.style.overflow = 'unset';
		overlay.setAttribute( 'class', '' );
		msgbox.setAttribute( 'class', '' );
		overlay.style.overflowY = 'unset';
		contentBox.innerHTML= '';
	}
	var photoQueue = [];
	var currentPos;
	window.onload = function() {initMedia();}