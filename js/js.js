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
				var queuePos = photoQueue.length-1;
				anchor.rel = queuePos;
				anchor.onclick = function () {showPhoto(this);}
				anchor.removeAttribute('href');
			}
			if (photoQueue!=undefined)
			{
				preloadPhoto(0);
			}
		}
	}
	function showPhoto(photo)
	{
		if (photoQueue==undefined)
		{
			return;
		}
		currentPos = parseInt(photo.rel, 10);
		if (photoPreload[currentPos]==undefined)
		{
			preloadPhoto(currentPos,true);
		}
		else
		{
			presentPhoto(photoPreload[currentPos]);
			prepareEnvironment();
			openMedia();
		}
		preloadPhoto(currentPos+1);
	}
	function preloadPhoto(number,start)
	{
		if (number==photoQueue.length){number=0;}
		if (number<0){number=photoQueue.length-1;}
		if (photoQueue[number] && photoPreload[number]==undefined)
		{
			photoPreload[number] = new Image();
			if  (start)
			{
				photoPreload[number].onload = function(){prepareEnvironment(); presentPhoto(this); openMedia();}
			}
			else
			{
				photoPreload[number].onload = function(){presentPhoto(this);}
			}
			photoPreload[number].onclick = function(){nextPhoto();}
			photoPreload[number].src = photoQueue[number];
		}
	}
	function presentPhoto(photo)
	{
		var msgbox = document.getElementById('msgbox');
		if (photo.height > 480)
		{
			var mediaHeight = 480;
		}
		else if (photo.width > 700)
		{
			var mediaHeight = 195 + 700/photo.width*photo.height;
		}
		else
		{
			var mediaHeight = photo.height;
		}
		document.getElementById('leftOver').style.height = mediaHeight+'px';
		document.getElementById('rightOver').style.height = mediaHeight+'px';
		photo.style.visibility = 'visible';
	}
	function nextPhoto()
	{
		if (currentPos!=undefined && photoQueue.length > 1)
		{
			currentPos = ((currentPos + 1)%photoQueue.length);
			if (photoPreload[currentPos]==undefined)
			{
				preloadPhoto(currentPos);
			}
			else
			{
				presentPhoto(photoPreload[currentPos]);
			}
			prepareEnvironment();
			preloadPhoto(currentPos+1);
		}
	}
	function prepareEnvironment()
	{
			if (contentBox==undefined)
			{
				var contentBox = document.getElementById('content-box');
			}
			contentBox.innerHTML= '';
			contentBox.appendChild(photoPreload[currentPos]);
			document.getElementById('mediaTitle').innerHTML = 'Фотография '+(currentPos+1)+' из '+photoQueue.length;	
	}
	function prevPhoto()
	{
		if (currentPos!=undefined && photoQueue.length > 1)
		{
			currentPos = (currentPos - 1);
			if (currentPos<0){currentPos=photoQueue.length-1;}
			if (photoPreload[currentPos]==undefined)
			{
				preloadPhoto(currentPos);
			}
			else
			{
				presentPhoto(photoPreload[currentPos]);
			}
			prepareEnvironment();
			preloadPhoto(currentPos-1);
		}
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
		window.onkeydown = function(e) {if(e.keyCode==37){prevPhoto();} if(e.keyCode==39){nextPhoto();}}
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
		currentPos = undefined;
		window.onkeydown = function() {}
	}
	var photoQueue = [];
	var photoPreload = [];
	var currentPos;
	window.onload = function() {initMedia();}