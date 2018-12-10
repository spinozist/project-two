/* eslint-disable max-len */
window.onload = function() {

  var map = L.map("map").setView([33.78, -84.35], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
  }).addTo(map);

  map.on("click", function(event) {
    console.log(event.latlng);
  });

  $.ajax({
    url: "/api/art",
    type: "GET"
  }).then(function(data) {
    var mapdata = data;
    console.log(mapdata);
    for (let i = 0; i < mapdata.length; i++) {
      L.marker([mapdata[i].latitude, mapdata[i].longitude])
        .addTo(map)
        .bindPopup(
          "<h5>" +
          mapdata[i].name +
          "</h5><h6>by " +
          mapdata[i].artist +
          "</h6><em>Posted by " +
          mapdata[i].User.username +
          "</em>"
        )
        .on("click", function (e) {
          console.log(e, mapdata[i].id);
          $("#art-info").html(
            "<img class='card-img-top' src='https://via.placeholder.com/200' alt='Card image cap'><h2 id='artNameDisplay'>" +
            mapdata[i].name +
            "</h2><hr>" +
            mapdata[i].artist +
            "</h6><small class='float-sm-right'>" +
            mapdata[i].User.username +
            "</small><hr><strong>Description: </strong><p>" +
            mapdata[i].description +
            "</p>"
          );
        });
    }
  });

  $("#enter-add-view").click(function() {
    console.log("button clicked");

    var selectLoc = [];
    var artName;
    var artistName;
    var artDescription;
    var imageUrl;

    // Art location input
    $("#new-art-modal").html(`
      <div class='modal-dialog' role='document'>
        <div class='modal-content p-3'>
          <div class='modal-header'>
            <h1 class='modal-title' id='exampleModalLabel'>New Art Submission</h1>
            <h3>Select location on the map</h3>
            <button type='button' class='close' data-dismiss='modal' aria-label='Close'>
            <span aria-hidden='true'>&times;</span>
            </button>
          </div>
          <div class='modal-body'>
           <div id='newPostMap'></div>
          </div>
          <div class='modal-footer'>
           <button type='button' class='btn btn-secondary' data-dismiss='modal'>Cancel</button>
           <button type='button' class='btn btn-success' id='artNextButton1'>Next</button>
          </div>
        </div>
      </div>
    `);

    var newPostMap = L.map("newPostMap").setView([33.78, -84.35], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
    }).addTo(newPostMap);
    newPostMap.on("click", function(event) {
      selectLoc = event.latlng;
      console.log(selectLoc);
      L.marker(selectLoc).addTo(newPostMap);
    });

    $("#artNextButton1").click(function() {
      // Art info input form
      $(".modal-content").html(`
        <div class='modal-header'>
          <h1 class='modal-title' id='exampleModalLabel'>New Art Submission</h1>
          <button type='button' class='close' data-dismiss='modal' aria-label='Close'>
            <span aria-hidden='true'>&times;</span>
          </button>
        </div>
        
        <small id='artHelp' class='form-text text-muted'>Can be left blank, will be listed as 'Untitled'</small>
            <div class='input-group mb-3'>
              <div class='input-group-prepend'>
                <span class='input-group-text'>
                  <i class='far fa-palette'></i>
                </span>
              </div>
              <input id='artName' type='text' class='form-control' placeholder='Art Name' aria-label='artName' aria-describedby='artName'>
            </div>
            <small id='artistHelp' class='form-text text-muted'>Can be left blank, will be listed as 'Unknown Artist'</small>
            <div class='input-group mb-3'>
              <div class='input-group-prepend'>
                <span class='input-group-text'>
                  <i class='far fa-signature'></i>
                </span>
            </div>
          <input type='text' class='form-control' id='artistName' placeholder='Artist Name' aria-label='artistName' aria-describedby='artistName'>
        </div>

        <div class='input-group'>
          <div class='input-group-prepend'>
            <span class='input-group-text'>
                <i class='far fa-pencil-paintbrush'></i>
            </span>
          </div>
            <textarea class='form-control' placeholder='Description' aria-label='With textarea' id="artDescription"></textarea>
          </div>
          <br>

          <div class='input-group mb-3'>
              <div class='input-group-prepend'>
                <span class='input-group-text'>
                  <i class='fas fa-image'></i>
                </span>
              </div>
              <input id='imageURL' type='text' class='form-control' placeholder='Image URL' aria-label='artName' aria-describedby='artName'>
          </div>

          <div class='input-group mb-3'>
            <div class='input-group-prepend'>
              <label class='input-group-text' for='categorySelect'><i class='far fa-paint-brush'></i>
              </label>
            </div>
            <select class='custom-select' id='categorySelect'>
                <option selected>Category</option>
                <option value='Graffiti'>Graffiti</option>
                <option value='Sculpture'>Sculpture</option>
                <option value='Painting'>Painting</option>
            </select>
          </div>
        </div>
        <div class='modal-footer'>
        <button type='button' class='btn btn-secondary' data-dismiss='modal'>Cancel</button>
        <button type='button' class='btn btn-success' id='submit-new-art'>Submit</button>
        </div>
      `);

      $("#submit-new-art").click(function() {
        artName = $("#artName").val();
        artistName = $("#artistName").val();
        artDescription = $("#artDescription").val();
        artCategory = $("#categorySelect option:selected").val();
        imageUrl = $("#imageURL").val();
        console.log(selectLoc);
        location.reload();

        console.log(
          artName +
          " by " + artistName + ". The description is " + artDescription + "@ " + imageUrl + " " + artCategory
        );

        $.ajax({
          url: "/api/art",
          type: "POST",
          data: {
            name: artName,
            artist: artistName,
            category: artCategory,
            description: artDescription,
            latitude: selectLoc.lat,
            longitude: selectLoc.lng,
            imageURL: imageURL
          }
        }).then(console.log("Art posted!"));
      });
    });

    $("#new-art-modal").modal({
      backdrop: true,
      keyboard: true,
      focus: true,
      show: true
    });
  });

  $("#loginButton").click(function () {
    console.log("button clicked");
    $("#login-modal").html(`
      <div class='modal-dialog' role='document'>
        <div class='modal-content'>
          <div class='modal-header'>
            <h1 class='modal-title' id='exampleModalLabel'>Sign In</h1>
            <button type='button' class='close' data-dismiss='modal' aria-label='Close'>
                <span aria-hidden='true'>&times;</span>
            </button>
          </div>
          <div class='modal-body'>
            <div class='input-group mb-3'>
                <div class='input-group-prepend'>
                    <span class='input-group-text'><i class='fas fa-envelope'></i></span>
                </div>
                <input type='text' id='new-user-email' class='form-control' placeholder='Username' aria-label='Username' aria-describedby='basic-addon1'>
            </div>
            <div class='input-group mb-3'>
                <div class='input-group-prepend'>
                    <span class='input-group-text'><i class='fas fa-user'></i></span>
                </div>
                <input type='text' id='new-username' class='form-control' placeholder='Username' aria-label='Username' aria-describedby='basic-addon1'>
            </div>
            <div class='modal-footer'>
                <button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>
                <button type='button' class='btn btn-primary'>Login</button>
            </div>
          </div>
        </div>
    </div>`
    );

    $("#login-modal").modal({
      backdrop: true,
      keyboard: true,
      focus: true,
      show: true
    });
  });


};
