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
				window.onresize = function() {if (currentPos!=undefined){resize();}}
				var h = getHash();
				if (h!=undefined)
				{
					if ((h.split('&')[0]=='photo')&&(parseInt(h.split('&')[1],10)>=0)&&(parseInt(h.split('&')[1],10)<photoQueue.length))
					{
						showPhoto(undefined,parseInt(h.split('&')[1],10));
					}
				}
			}
		}
	}
	function showPhoto(photo,number)
	{
		if (photoQueue==undefined)
		{
			return;
		}
		if (photo!=undefined)
		{
			currentPos = parseInt(photo.rel, 10);
			var l = document.createElement( 'div' );
			l.setAttribute('class', 'loading')
			l.setAttribute('id', 'qLoadAnim')
			photo.appendChild(l);
				if (currentPos!=undefined)
				{
					photoPreload[currentPos].onload = function(currentPos){if (currentPos==arguments[0]){resize();}}
					var l = document.getElementById('qLoadAnim'); 
					l.parentNode.removeChild(l);
				}
		}
		else
		{
			currentPos = number;
		}
		if (photoPreload[currentPos]==undefined)
		{
			preloadPhoto(currentPos,true);
		}
		else
		{
			prepareEnvironment();
			openMedia();
			if (photoPreload[currentPos].naturalWidth>0)
			{
				resize();
			}
		}
		preloadPhoto(currentPos+1);
		preloadPhoto(currentPos-1);
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
				photoPreload[number].onload = function(){prepareEnvironment(); openMedia(); if (currentPos==number){resize();}}
			}
			else
			{
				photoPreload[number].onload = function(){if (currentPos==number){resize();}}
			}
			photoPreload[number].src = photoQueue[number];
			if (currentPos==number)
			{
				prepareEnvironment();
			}
		}
	}
	function resize()
	{
		if ((currentPos!=undefined)&&(photoPreload[currentPos].naturalWidth>0))
		{
			var overlay = document.getElementById('overlay');
			if ((overlay.clientWidth*.8-20>photoPreload[currentPos].naturalWidth)&&(overlay.clientHeight-80>photoPreload[currentPos].naturalHeight))
			{
				document.getElementById('msgbox').style.width=(photoPreload[currentPos].naturalWidth+20)+'px';
				document.getElementById('msgbox').style.height=(photoPreload[currentPos].naturalHeight + 50)+'px';
				//alert('1');
			}
			else if (overlay.clientHeight-80<=photoPreload[currentPos].naturalHeight)
			{
				document.getElementById('msgbox').style.width=(photoPreload[currentPos].naturalWidth*(overlay.clientHeight-80)/photoPreload[currentPos].naturalHeight+20)+'px';
				document.getElementById('msgbox').style.height=(overlay.clientHeight-30)+'px';
				//alert('2');
			}
			else if (overlay.clientWidth*.8-20<=photoPreload[currentPos].naturalWidth)
			{
				document.getElementById('msgbox').style.height=(photoPreload[currentPos].naturalHeight*(overlay.clientWidth*.8-20)/photoPreload[currentPos].naturalWidth+50)+'px';
				document.getElementById('msgbox').style.width=(overlay.clientWidth*.8)+'px';
				//alert('3');
			}
		}
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

			}
			prepareEnvironment();
			if (photoPreload[currentPos].width>0)
			{
				resize();
			}
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

			}
			prepareEnvironment();
			if (photoPreload[currentPos].width>0)
			{
				resize();
			}
			preloadPhoto(currentPos-1);
		}
	}
	function showVideo(src,title)
	{
		openMedia();
		msgbox.setAttribute( 'class', 'show mediaVideo' );
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
		document.getElementById('msgbox').style.width = '780px';
	}
	function openMedia()
	{
		if (document.getElementById('qLoadAnim')!=undefined)
		{
			var l = document.getElementById('qLoadAnim'); 
			l.parentNode.removeChild(l);
		}
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
		//overlay.style.overflowY = 'scroll';
		body.style.overflow = 'hidden';
		if (currentPos!=undefined)
		{
			window.onkeydown = function(e) {if(e.keyCode==37){prevPhoto();} if(e.keyCode==39){nextPhoto();}}
			overlay.onmousemove = function(e) {updateMouse(e.clientX,e.clientY);}
			document.getElementById('rMedia').setAttribute( 'class', '' );
			document.getElementById('lMedia').setAttribute( 'class', 'show' );
		}
		else
		{
			document.getElementById('rMedia').setAttribute( 'class', 'closeMedia' );
			overlay.onmouseenter = function() {overlayHover();}
		}
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
		//overlay.style.overflowY = 'unset';
		contentBox.innerHTML= '';
		if (currentPos!=undefined)
		{
			document.getElementById('lMedia').setAttribute( 'class', '' );
			overlay.onmousemove = undefined;
			currentPos = undefined;
		}
		else
		{
			overlay.onmouseenter = undefined;
		}
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
			if (x>window.innerWidth*.98)
			{
				if (msideState!='r')
				{
					document.getElementById('rMedia').setAttribute( 'class', 'a right' );
					document.getElementById('lMedia').setAttribute( 'class', 'show' );
					msideState = 'r';
				}
			}
			else if (mOnClose)
			{
				if (msideState!='c')
				{
					document.getElementById('rMedia').setAttribute( 'class', 'a' );
					document.getElementById('lMedia').setAttribute( 'class', 'show' );
					msideState = 'c';
				}
			}
			else if (y<=screen.height*.25)
			{
				if ((msideState == undefined)||((msideState == 'c')&&(y - lastY>0)))
				{
					document.getElementById('rMedia').setAttribute( 'class', 'a right' );
					document.getElementById('lMedia').setAttribute( 'class', 'show' );
					msideState = 'r';
				}
				else if ((msideState=='r')&&(y - lastY<0))
				{
					document.getElementById('rMedia').setAttribute( 'class', 'a' );
					document.getElementById('lMedia').setAttribute( 'class', 'show' );
					msideState = 'c';
				}
			}
			else
			{
				if (msideState!='r')
				{
					document.getElementById('rMedia').setAttribute( 'class', 'a right' );
					document.getElementById('lMedia').setAttribute( 'class', 'show' );
					msideState = 'r';
				}
			}
		}
		else
		{
			if (msideState!='l')
			{
				document.getElementById('rMedia').setAttribute( 'class', '' );
				document.getElementById('lMedia').setAttribute( 'class', 'a show' );
				msideState = 'l';
			}
		}
		lastX = x;
		lastY = y;
	}
	function overlayLeave()
	{
		document.getElementById('rMedia').setAttribute( 'class', '' );
		if (currentPos!=undefined)
		{
			
			document.getElementById('lMedia').setAttribute( 'class', 'show' );
		}
		msideState = undefined;	
	}
	function overlayHover()
	{
		document.getElementById('rMedia').setAttribute( 'class', 'a' );
		msideState = 'c';
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
	function hoverClose()
	{
		mOnClose = true;
	}
	function leaveClose()
	{
		mOnClose = false;
	}
	function getHash() 
	{
    	var h = window.location.hash.substring(1);
    	//switch (h) 
    	//{
    	//    case 'photo':
    	//    case 'video':
		//}
		return h;
	}
	var photoQueue = [];
	var photoPreload = [];
	var photoWidth = [];
	var photoHeight = [];
	var currentPos;
	var msideState;
	var lastX = 0;
	var lastY = 0;
	var mOnClose;
	window.onload = function() {initMedia();}