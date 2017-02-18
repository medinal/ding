var allCoursesArr = [];
var enrollsArr = [];

var $allCourses;
var $teachCourses;
var $availableCourses;
var $enrolledCourses;

var $currentId = 0;

$(document).ready(function(){
  $everything = $('.everything');
  $allCourses = $('.all-courses');
  $teachCourses = $('.teach-courses');
  $availableCourses = $('.available-courses');
  $enrolledCourses = $('.enrolled-courses');

  // USER LIST AJAX
  $.ajax({
    method: "GET",
    url: "/users",
    success: function(users){
      users.forEach(function(user){
        renderUser(user);
      })
    },
    error: onError
    });

  $('#main-panel').on('click', '.enroll-btn', function(){
    console.log("enroll!")
  })

  $('#main-panel').on('click', '.edit-btn', function(){
    console.log("Edit!!")
  })

  $('#main-panel').on('click', '.trash-btn', function(){
    console.log("trash!")
  })

  $('#main-panel').on('click', '.unenroll-btn', function(){
    console.log("unenroll!")
  })

  $('.user-dropdown').on('click', '.dropdown-item', function(e){
    e.preventDefault();
    $('.everything').empty();
    $currentId = $(this).attr('data-id');
    populateData();
  });

}); // closes $(document).ready()

//render users to dropdown
var renderUser = function(user){
  $('.user-dropdown').append(`
  <a class="dropdown-item" href="#" data-id="${user._id}">${user.name}</a>`)
}

function populateData(){
  var counter = 0;
  $.ajax({
    method: "GET",
    url: "/enrolls",
    success: function(enrolls){
      enrollsArr = [];
      enrollsArr =enrolls;
      $.ajax({
        method: "GET",
        url: "/courses",
        success: function(courses){
          allCoursesArr = [];
          allCoursesArr = courses;
          renderAll(allCoursesArr);
        },
        error: onError
      });
    },
    error: onError
  });
}

function renderOne(course){
  var innerHTML =
    `<hr>
    <div class="course-panel container-fluid">
      <div class="course-title clearfix">
        <button class="${hiddenEnroll} enroll-btn btn btn-lg btn-danger" type="button" name="enroll" data-id="${course._id}">Enroll me</button>
        <button class="${hiddenUnenroll} unenroll-btn btn btn-lg btn-danger" type="button" name="unenroll" data-id="${course._id}">Unenroll me</button>
        <h3>${course.name}</h3>
        <br>
        <p><strong>Taught by:</strong>  ${course.teacher.name}</p>
        <p><strong>Description:</strong>  ${course.description}</p>
        <p><strong>Capacity:</strong>  ${course.capacity}</p>
      </div>
        <div class="btn-group class-btn-group">
        <button type="button" class="${hiddenEdit} edit-btn btn btn-default btn-md" dataId='${course._id}'>edit</button>
        <button type="button" class="${hiddenTrash} trash-btn btn btn-default btn-md" dataId='${course._id}'>trash</button>
      </div>
    </div>`
  var hiddenEnroll;
  var hiddenUnenroll;
  var hiddenEdit;
  var hiddenTrash;
  if ($currentId===course.teacher._id){
    hiddenUnenroll = "hidden";
    hiddenEnroll = "hidden";
    $teachCourses.prepend(innerHTML);
  } else if (checkEnroll(course)){
    hiddenEnroll = "hidden";
    hiddenEdit = "hidden";
    hiddenTrash = "hidden";
    $enrolledCourses.prepend(innerHTML);
  } else {
    hiddenUnenroll = "hidden";
    hiddenEdit = "hidden";
    hiddenTrash = "hidden";
    $availableCourses.prepend(innerHTML);
  }
}

function renderAll(courses){
  courses.forEach(function(course){
      renderOne(course);
    })
  }

function checkEnroll(course){
  for (i=0; i<enrollsArr.length; i++){
    if(enrollsArr[i].user._id === $currentId){
      return true;
    }
  }
}

function onSuccess(){
  console.log("Yay!");
}

function onError(){
  console.log("Oh No!");
}
