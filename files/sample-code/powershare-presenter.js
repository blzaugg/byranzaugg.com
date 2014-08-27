$(document).ready(function () {
	$("#tree").explrTree();
});

function animatePreviewAndSelect(state,milliseconds) {
	var PreviewandSelect = $('#PreviewandSelect');
	if ('open' == state) {
		PreviewandSelect.slideDown(milliseconds);
	} else if ('close' == state) {
		PreviewandSelect.slideUp(milliseconds);
	}
}

function loadFolderMedia(element) {
	//animatePreviewAndSelect('close',200);
	animatePreviewAndSelect('close',0);
	$.ajaxSetup({cache: false});
	$('#PreviewandSelect').load($(element).attr("href"), function() {
		hookOverlayClicks();
		animatePreviewAndSelect('open',400);
	});
}

function emptyPlaylistMessage(command) {
	var playlist = $('#mediaTable');
	if ('add' == command) {
		//console.log('playlist.find(tr).length: ' +playlist.find('tr').length);
		if (playlist.find('tr').length == 0) {
			playlist.append('<tr class="justadded" style="display:none;" id="emptyplaylistinfo"><td align="center">-- Add videos from the Preview and Select panel. --</td></tr>');
			$('#mediaTable .justadded').fadeIn();
			$('#mediaTable .justadded').removeClass('justadded');
		}
	} else if ('remove' == command) {
		$('#emptyplaylistinfo').remove();
	}
}

function addVideoToPlayList(videoTitle,videoTime,videoId) {
	emptyPlaylistMessage('remove');
	var content = $('<tr class="justadded" style="display:none;" />');
		//TODO: Figure out why jQuery doesn't add click event handler.
	//content.append('<td align="left" class="First" width="250"><a href="jwplayer?videoid=' + videoId + '" rel="#videoPopup" class="videoPopup">' + videoTitle + '</a><input type="hidden" value="' + videoId + '" class="videoId" /></td>'); 
	content.append('<td align="left" class="First" width="250">' + videoTitle + '<input type="hidden" value="' + videoId + '" class="videoId" /></td>');
	content.append('<td align="right">' + videoTime + '</td>');
	content.append('<td align="right"><img class="videoup" src="/images/arrow-up.png" /> <img class="videodown" src="/images/arrow-down.png" /></td>');
	content.append('<td align="right" class="Last"><img class="removevideo" src="/images/cross-small.png" /></td>');
	$('#mediaTable').append(content);
			
	$('#mediaTable .justadded').fadeIn();
	$('#mediaTable .justadded').removeClass('justadded');
	hookOverlayClicks(); //TODO: Figure out why jQuery doesn't add click event handler.
	closePreviewPane();
}

function removeVideoFromPlayList(element) {
	var tr = element.parents('#mediaTable tr');
	tr.fadeOut('fast', function() {
		$(this).remove();
		emptyPlaylistMessage('add');
	});
}

function moveVideo(direction, element) {
	var trToMove = element.parents('#mediaTable tr');
	var trAbove = trToMove.prev('tr');
	var trBelow = trToMove.next('tr');
	trToMove.fadeOut('fast', function() {
		if ('up' == direction) {
			trToMove.insertBefore(trAbove);
		} else if ('down' == direction) {
			trToMove.insertAfter(trBelow);
		}
		trToMove.fadeIn();
	});
			
}

function hookOverlayClicks() {
	//console.log('hookOverlayClicks()');
	$(".videoPopup[rel]").overlay({
		mask: {
			color: '#ebecff',
			loadSpeed: 200,
			opacity: 0.7
		},
		closeOnClick: false,
		onBeforeLoad: function() {
			//console.log('onBeforeLoad()');
			// grab wrapper element inside content
			var wrap = this.getOverlay().find(".contentWrap");

			// load the page specified in the trigger
			//$.ajaxSetup({cache: false});
			//wrap.load(this.getTrigger().attr("href"));
			wrap.attr('src', this.getTrigger().attr("href"));
		},
		onClose: function() {
			var wrap = this.getOverlay().find(".contentWrap");
			//wrap.empty();
			wrap.attr('src', ''); //remove frame content
		}
	});
}

$(document).ready(function () {
	$('#tree a[id]').not($('#tree a+ul').prev()).bind('click', function(event) {
		event.preventDefault();
		loadFolderMedia(this);
	});

	$(".videoPopup[rel]").live('click', function(){
		return false;
	});

	$('.list-view > li .addPlaylist').live('click', function(){
		var videoTitle = $(this).siblings('[name="videoTitle"]').val();
		var videoTime = $(this).siblings('[name="videoTime"]').val();
		var videoId = $(this).siblings('[name="videoId"]').val();
		addVideoToPlayList(videoTitle,videoTime,videoId);
		return false;
	});

	$('.preview-pane .preview .addPlaylist').live('click', function(){
		var previewpane = $(this).parents('.preview-pane .preview');
		var videoTitle = previewpane.find('[name="videoTitle"]').val();
		var videoTime = previewpane.find('[name="videoTime"]').val();
		var videoId = previewpane.find('[name="videoId"]').val();
		addVideoToPlayList(videoTitle,videoTime,videoId);
		return false;
	});

	$('.removevideo').live('click', function(){
		removeVideoFromPlayList($(this));
		return false;
	});

	$('.videoup').live('click', function(){
		moveVideo('up', $(this));
		return false;
	});

	$('.videodown').live('click', function(){
		moveVideo('down', $(this));
		return false;
	});

	hookOverlayClicks();

	emptyPlaylistMessage('add');
});

