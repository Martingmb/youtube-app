watchForm();

function handleFetch(searchTerm, callback) {

    let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyAnVAbKS-_yluPm7v4l4LwF2I-Ic0WrydQ&q=${searchTerm}&type=video&maxResults=10`;

    fetch(url, { method: "GET", path: "/youtube/v3/search" }).then(Response => {
        if (Response.ok) {
            return Response.json();
        } else {
            throw new Error('Big Yikes');
        }
    }).then(responseJSON => {
        callback(responseJSON);
    }).catch(err => {
        $('.results').html(err.message);
    })

}

function newPage(nextPageToken, callback) {
    var searchTerm = $('#ytSearchBox').val();
    let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyAkXbtElbBFeYVpIGnNGOnmLQmRMdyjW1c&pageToken=${nextPageToken}&q=${searchTerm}&type=video&maxResults=10`;

    fetch(url, { method: "GET", path: "/youtube/v3/search" }) //Could be fetch(url, {method: "GET"})
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new error("Try again later...");
            }
        })
        .then(responseJson => {
            callback(responseJson);
        })
        .catch(err => {

            $('#itemList').html(err.message);
            console.log(err);
        })
}

function displayResults(data) {
    $('.results').html('');
    for (var i = 0; i < data.items.length; i++) {

        var video =
            `<div><a href="https://www.youtube.com/watch?v=${data.items[i].id.videoId}"> 
                <h3>${data.items[i].snippet.title}</h3>
                <img src="${data.items[i].snippet.thumbnails.default.url}">
            </a></div>`

        $('.results').append(video)

    }

    if (data.prevPageToken) {
        var button = `<button id="prevPage">Prev Page</button>`
        $('.results').append(button)
    }

    if (data.nextPageToken) {
        var button = `<button id="nextPage">Next Page</button>`
        $('.results').append(button)
    }

    $('#nextPage').click(function() {
        newPage(data.nextPageToken, displayResults);
    })

    $('#prevPage').click(function() {
        newPage(data.prevPageToken, displayResults);
    })
}

function watchForm() {
    $('.youtubeForm').on('submit', (event) => {
        event.preventDefault();
        var search = $('#ytSearchBox').val();
        handleFetch(search, displayResults);
    })
}