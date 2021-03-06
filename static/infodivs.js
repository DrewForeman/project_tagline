
// v|v|v|v|v|v|v HELPER FUNCTIONS AND VARIABLES TO GENERATE AND DISPLAY QUERIED TAGS v|v|v|v|v|v|v|v|v|

/** Display all markers and information for queried tags. 
Includes sidebar list of all tags + sidebar info for each indiv tag on marker click. */
function displayTags(queriedTags){
  var infoDiv = ''
  assignMarkers(queriedTags);
}

/** Create marker for each tag returned in query and bind related tag information. */
function assignMarkers(tags){


  //empty the divs for new tags
  $('#tag-div-1').html('');
  $('#tag-div-2').html(''); 
  $('#tag-div-3').html('');

  // var counter = 0;  //set up a count of the tags so it knows to which page column to append the tag div
  var counterA = 0;
  var counterB = 0

  var tag, marker;
  for (var key in tags) {
    // console.log(Object.keys(tags).length)
    // console.log(tags);

      counterA++;
      counterB++;
      if (counterA > 3) {
        counterA = 1;
      }

      tag = tags[key];

      pos = new google.maps.LatLng(tag.latitude, tag.longitude)
      marker = createMarker(pos, 
                           {path: fontawesome.markers.CIRCLE,
                            // url: 'static/img/marker.png',
                            scale: 0.5,
                            strokeColor:'black',
                            strokeOpacity: 0.5,
                            fillColor: 'black',
                            fillOpacity: 0.5
                           }, 
                           tag.title)

      allMarkersArray.push(marker) //need to add to array so it can be emptied upon next query

      
      if (counterB === Object.keys(tags).length) {

        infoDiv = ('<div class="card highlight-outline" id="card-base-'+tag.tagId+'">' +
                   '<div class="card highlight" data-toggle="collapse" data-target="#'+tag.tagId+'">' +
                   '<div class="card-block highlight-block-upper">' +
                   '<div class="pull-right"><a href="#"><img class="media-object img-circle" src="/static/img/avatars/drewf.jpg" alt="avatar" style="display:inline-block; margin-left:4px; opacity:0.8;"></a></div>' +
                   '<div class="pull-right small-text" style="text-align:right; line-height:95%; font-size:13px;">Tagged by<br>drewf</div>'+
                   '<h4 class="card-title" style="margin-bottom:0;"><b style="font-size:20px;">The latest: </b><br>'+tag.title+'</h4>'+
                   '</div>' +
                   '<div class="highlight-img-container">' +
                   '<img class="img-fluid highlight-img" src="'+tag.primaryImage+'" alt="Responsive image">' +
                   '</div></div>'
                  )
          addDetailsToDiv(tag);
          addMediaToDiv(tag);
          addCommentsToDiv(tag);
          bindMarkerInfo(marker, infoDiv, tag, 0)

      } else {
        buildTagDisplayDiv(tag)
        bindMarkerInfo(marker, infoDiv, tag, counterA);
      }
  }
}


/** Create marker at given location. */
function createMarker(position, icon, title=null){
  marker = new google.maps.Marker({
                          position: position,
                          map: map,
                          title: title,
                          icon: icon
                      });
  return marker
}


/** Build div displaying all information for tag. */
function buildTagDisplayDiv(tag){
  infoDiv = ''

  createDisplayBase(tag);
  addDetailsToDiv(tag);
  addMediaToDiv(tag);
  addCommentsToDiv(tag);
}

/** Create basic image and title display that shows on load. */
function createDisplayBase(tag){
  infoDiv = '<div class="card card-inverse" id="card-base-'+tag.tagId+'">';
  if (tag.primaryImage) {
    infoDiv += '<img class="card-img" src="'+tag.primaryImage+'" alt="Card image" style="width: 100%;">' +
               '<div class="card-img-overlay" style="background-color: rgba(51,51,51,0.4);" data-toggle="collapse" data-target="#'+tag.tagId+'" id="img-toggle-'+tag.tagId+'">' +
               // '<div class="card-img-overlay" style="background-color: rgba(255,255,255,0.4);" data-toggle="collapse" data-target="#'+tag.tagId+'" id="img-toggle-'+tag.tagId+'">' +
               '<h4 class="card-title">'+tag.title+'</h4>' +
               '<p class="card-text">'+tag.excerpt+'</p>'
  } else {
    infoDiv += '<div class="card-block grey-block" data-toggle="collapse" data-target="#'+tag.tagId+'" style="background-color: rgba(51,51,51,0.7);">' +
               '<h4 class="card-title">'+tag.title+'</h4>' +
               '<p class="card-text">'+tag.excerpt+'</p>' 
  }
  if (tag.comments[0]) {
    var i = tag.comments.length - 1
    infoDiv +='<p class="subtext small-text"><i>"'+tag.comments[i][Object.keys(tag.comments[i])].content+'"</i></p>'
  }
   infoDiv += '</div>'
}

/** Add tag media to div. Multiple media items are possible. */
function addMediaToDiv(tag){
  var media = tag.media;
  if (media[0]) {
    infoDiv += '<li class="list-group-item">'
    for (var i = 0; i < media.length; i++){
      for (var key in media[i]){
        mediaObject = media[i][key]
      }
      if (mediaObject.media_type === "image"){  
        infoDiv += '<a href="'+mediaObject.url+'" target="_blank">' +
                   '<img src="'+mediaObject.url+'" alt="img-thumbnail" title="Click to view" border="2" width="64" height="64" hspace="2" /></a>'
      } 
      else if (mediaObject.media_type === "audio"){
        infoDiv += '<audio style="width:100%; vertical-align: middle;" controls><source src="'+mediaObject.url+'">Your browser does not support the audio element.</audio>'
      } else { 
        infoDiv += '<video width="100%" controls><source src="'+mediaObject.url+'" ></video>'
      }
    } infoDiv += '</li>'
  } 
}


/** Add tag details to display div to collapse open on click. */
function addDetailsToDiv(tag) {
  infoDiv += '<div data-toggle="collapse" id="'+tag.tagId+'" class="collapse" aria-expanded="false">' +
            '<ul class="list-group list-group-flush drop-text" id="details-'+tag.tagId+'">' +
            '<li class="list-group-item"><div><h5>'+tag.title+'</h5>'
  
  if (tag.artist){ 
      infoDiv += tag.artist + '<br><br>'
  }

  infoDiv += tag.details +'</div></li>' 
}


// TO DO !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// fix this so users can leave media as well

/** Add tag comments to div ordered by date. */
function addCommentsToDiv(tag) {

  // new comment form 
  infoDiv += '<li class="list-group-item" id="add-comment-'+tag.tagId+'">' +
             '<form class="form input-group input-group-lg" id="comment-form-'+tag.tagId+'">' +
             '<input type="text" class="form-control" placeholder="Say something..."  id="new-comment-'+tag.tagId+'">' +
             // '<input type="file" id="file-'+tag.tagId+'" accept="image/*" >' +
             '<i class="fa fa-microphone" aria-hidden="true"></i>' +
             '<i class="fa fa-picture-o" aria-hidden="true"></i>' +
             '<i class="fa fa-video-camera" aria-hidden="true"></i>' +
             '<button type="button" class="btn btn-secondary btn-sm pull-right post-button" style="margin-top:4px;" id="submit-comment-'+tag.tagId+'">' +
             'Post</button>' +
             '</form>' +
             '</li>' +
             '</ul>'

  // comments display
  var comments = tag.comments;

  if (comments){
    var commentsList = '<ul class="list-group list-group-flush drop-text" id="all-comments-'+tag.tagId+'" style="overflow-y: scroll; max-height:350px;">'
    var comment, username, date, content;

    for (var i = (comments.length - 1); i >=0; i--){
      for (var key in comments[i]){
        comment = comments[i][key]
      } commentsList += '<li class="list-group-item comment-list">' +
                        '<div class="media">' +
                        '<div class="media-left">' + 
                        '<a href="#"><img class="media-object img-circle" src="'+comment.avatar+'" alt="user-avatar"></a>' +
                        '</div>' +
                        '<div class="media-body">' +
                        // '<b>'+ comment.username +'</b><span class="card-text"><small class="text-muted">  '+comment.time+
                        comment.username +'<span class="card-text"><small class="text-muted">  '+comment.time+
                        '</small></span><br><span class="small-text">'+comment.content+'</span>' + 
                        '</div>' +
                        '</div>' +
                        '</li>'
    } infoDiv += commentsList 
  } infoDiv += '</ul></div></div></div></div>'
}


/** Bind marker and related info, add to page and attach event listener to submit comments. */
function bindMarkerInfo(marker, infoDiv, tag, counter){
  
  if (counter === 0){
    $('#highlight-space').html(infoDiv)
  } else if (counter === 1){
    $('#tag-div-2').append(infoDiv);
  } else if (counter === 2){
    $('#tag-div-3').append(infoDiv);
  } else {
    $('#tag-div-1').append(infoDiv);
  }

  google.maps.event.addListener(marker, 'mouseover', function() {
    marker.setIcon({path: fontawesome.markers.CIRCLE,    
                      scale: 0.5,
                      strokeColor:'#fcf400',
                      strokeWeight: 3,
                      strokeOpacity: 1,
                      fillColor: 'black',
                      fillOpacity: 0.5
                     })
    $('#card-base-'+tag.tagId).css('border','3px solid #fcf400');
    $('#img-toggle-'+tag.tagId).toggleClass('hidden-overlay');
    });

    google.maps.event.addListener(marker, 'mouseout', function() {
    marker.setIcon({path: fontawesome.markers.CIRCLE,    
                      scale: 0.5,
                      strokeColor:'black',
                      strokeOpacity: 0.5,
                      fillColor: 'black',
                      fillOpacity: 0.5
                     })
    $('#card-base-'+tag.tagId).css('border','1px solid #ccc');
    $('#img-toggle-'+tag.tagId).toggleClass('hidden-overlay');
    });

  // on click of marker, tag display scrolls open/closed
  google.maps.event.addListener(marker, 'click', function() {
      clearClickMarker()
      $('#'+tag.tagId).collapse('toggle');
      $('#img-toggle-'+tag.tagId).toggleClass('hidden-overlay');

      // marker.setIcon({path: fontawesome.markers.CIRCLE,    
      //                 scale: 0.5,
      //                 strokeColor:'#0099cc',
      //                 strokeOpacity: 0.5,
      //                 fillColor: '#0099cc',
      //                 fillOpacity: 1
      //                })
    });
}


function submitComment (evt) {

  var id = this.id.split('-')[2];
  var comment = $('#new-comment-'+id).val();

  $.post('/add-comment.json', 
    {'comment': comment, 'tagId': id}, 
    updateCommentsList);
}


function updateCommentsList(newComment){

  var tagId = newComment.tagId;

  $('#all-comments-'+tagId).prepend(
            '<li class="list-group-item">' +
            '<div class="media">' +
            '<div class="media-left">' + 
            '<a href="#"><img class="media-object img-circle" src="'+newComment.avatar+'" alt="user-avatar"></a>' +
            '</div>' +
            '<div class="media-body">' +
            '<b>'+ newComment.username +'</b><span class="card-text"><small class="text-muted">  '+
            newComment.time+'</small></span><br><span class="small-text">'+newComment.content+'</span>' + 
            '</div>' +
            '</div>' +
            '</li>'
        );
  // console.log($('#comment-form-'+tagId)[0])
  $('#comment-form-'+tagId)[0].reset(); 
}




