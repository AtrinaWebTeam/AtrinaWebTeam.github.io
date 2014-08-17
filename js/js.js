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
			photoPreload[number].src = photoQueue[number];
		}
	}
	function presentPhoto(photo)
	{
		var msgbox = document.getElementById('msgbox');
		if (photo.height > 480)
		{
			var mediaHeight = 480 + 145;
		}
		else if (photo.width > 700)
		{
			var mediaHeight = 145 + 700/photo.width*photo.height;
		}
		else
		{
			var mediaHeight = photo.height + 145;
		}
		//document.getElementById('leftOver').style.height = mediaHeight+'px';
		//document.getElementById('rightOver').style.height = mediaHeight+'px';
		//document.getElementById('ldoOver').style.height = (mediaHeight-50)+'px';
		//document.getElementById('rdoOver').style.height = (mediaHeight-50)+'px';
		//document.getElementById('cdoOver').style.height = (mediaHeight-50)+'px';		
		//document.getElementById('overlay').style.height = mediaHeight+'px';
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
			if (overlay==undefined)
			{
				var overlay = document.getElementById('overlay');
			}
			contentBox.innerHTML= '';
			//overlay.style.width = '1317px';
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
		msgbox.setAttribute( 'class', 'show' );
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
		msideState = undefined;
		window.onkeydown = function() {}
	}
	function scaleActive(button)
	{
		button.style.transform = "scale(1.2)";
		var id = setTimeout(function() { scaleInactive(button); }, 100);
	}
	function scaleInactive(button)
	{
		button.style.transform = "scale(1)";
	}
	function updateMouse(x,y)
	{
		if (x>window.innerWidth*.5)
		{
			if (y<=screen.height*.25)
			{
				if ((msideState == undefined)||((msideState == 'c')&&(y - lastY>0)))
				{
					document.getElementById('rMedia').setAttribute( 'class', 'a' );
					document.getElementById('lMedia').setAttribute( 'class', '' );
					msideState = 'r';
				}
				else if ((msideState=='r')&&(y - lastY<0))
				{
					document.getElementById('rMedia').setAttribute( 'class', 'closeMedia' );
					document.getElementById('lMedia').setAttribute( 'class', '' );
					msideState = 'c';
				}
			}
			else
			{
				if (msideState!='r')
				{
					document.getElementById('rMedia').setAttribute( 'class', 'a' );
					document.getElementById('lMedia').setAttribute( 'class', '' );
					msideState = 'r';
				}
			}
		}
		else
		{
			if (msideState!='l')
			{
				document.getElementById('rMedia').setAttribute( 'class', '' );
				document.getElementById('lMedia').setAttribute( 'class', 'a' );
				msideState = 'l';
			}
		}
		lastX = x;
		lastY = y;
	}
	function overlayLeave()
	{
		document.getElementById('rMedia').setAttribute( 'class', '' );
		document.getElementById('lMedia').setAttribute( 'class', '' );	
		msideState = undefined;	
	}
	function overlayClick()
	{
		switch(msideState)
		{
			case 'r': {nextPhoto(); break;}
			case 'l': {prevPhoto(); break;}
			case 'c': {closeMedia(); break;}
		}
	}
	var photoQueue = [];
	var photoPreload = [];
	var currentPos;
	var msideState;
	var lastX = 0;
	var lastY = 0;
	window.onload = function() {initMedia();}