// client/dashboard ~ app.js

// GLOBALS
var allCoursesArr = [];
var enrollsArr = [];

var $allCourses;
var $teachCourses;
var $availableCourses;
var $enrolledCourses;

var $currentId = null;

// ON PAGE LOAD:
$(document).ready(function(){

  // divs grabbed with jQuery
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

  // SUBMIT A NEW CLASS
  $('.add-class').on('submit', function(e){
    e.preventDefault();
    $('#add-modal').modal('toggle');
    var data = $('.add-class').serialize();
    $('.add-class')[0].reset();
    $.ajax({
      method: "POST",
      url: "/courses",
      data: data,
      success: renderOne,
      error: onError
    });
  });
  // REMOVE A CLASS
  $('.main-panel').on('click', '.trash-btn', function(){
    var data = {courseId: $(this).data('id')};
    $.ajax({
      method: "DELETE",
      url: "/courses",
      data: data,
      success: populateData,
      error: onError
    });
  })


  // ENROLL IN A CLASS
  $('.main-panel').on('click', '.enroll-btn', function(){
    var thisId = $(this).data('id');
    var data = {userId: $currentId,
                courseId: thisId};
    $.ajax({
      method: "POST",
      url: "/enrolls",
      data : data,
      success: populateData,
      error: onError
    });
  })
  // UNENROLL FROM A CLASS
  $('.main-panel').on('click', '.unenroll-btn', function(){
    console.log("unenroll!")
    var thisId = $(this).data('id');
    var data = {userId: $currentId,
      courseId: thisId};
      $.ajax({
        method: "DELETE",
        url: "/enrolls",
        data : data,
        success: populateData,
        error: onError
      });
    })


  // EDIT BUTTON EVENT LISTENER (SETS COURSE ID FOR MODAL AND MIN CAPACITY)
  $('.main-panel').on('click', '.edit-btn', function(){
    var thisId = $(this).data('id');
    var minCapacity = checkCapacity(thisId);
    $('.course-capacity').attr("min", minCapacity);
    $('.course-id').val(thisId);
  });

  // UPDATE A CLASS
  $('.edit-class').on('submit', function(e){
    e.preventDefault();
    var newCapacity = $('.course-capacity').val()
    var thisId = $('.course-id').val();
    var numEnrolls = countEnroll(thisId);
    $('.spots-left').val(newCapacity-numEnrolls);
    $('#edit-modal').modal('toggle');
    var data = $('.edit-class').serialize();
    console.log(data);
    $('.edit-class')[0].reset();
    $.ajax({
      method: "PUT",
      url: "/courses",
      data: data,
      success: populateData,
      error: onError
    });
  })


  // USER DROPDOWN MENU EVENT LISTENER (CHANGES USER ID ON USER SELECTION)
  $('.user-dropdown').on('click', '.dropdown-item', function(e){
    e.preventDefault();
    $('.add-btn').removeClass('hidden');
    $('.everything').empty();
    $currentId = $(this).attr('data-id');
    $('.user-id').val($currentId);
    populateData();
  });

}); // closes $(document).ready()

// FUNCTIONS OUTSIDE PAGE LOAD

//render users to dropdown
var renderUser = function(user){
  $('.user-dropdown').append(`
  <a class="dropdown-item" href="#" data-id="${user._id}">${user.name}</a>`)
}

// pulls important data from server & sends to render
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

// renders a single course to views/index.html
function renderOne(course){
  var part1 = `<hr>
              <div class="course-panel container-fluid">
              <div class="course-title clearfix">
              <div>`;
  var enrollBtn = `<button class="enroll-btn btn btn-lg btn-success" type="button" name="enroll" data-id="${course._id}">Enroll me</button>`;
  var courseFull = `<span>Course Full</span>`
  var unenrollBtn = `<button class="unenroll-btn btn btn-lg btn-danger" type="button" name="unenroll" data-id="${course._id}">Unenroll me</button>`;
  var part2 = `<h3>${course.name}</h3>
              <br>
              <p><strong>Taught by:</strong>  ${course.teacher.name}</p>
              <p><strong>Description:</strong>  ${course.description}</p>
              <p><strong>Capacity:</strong>  ${course.capacity}</p>
              <p><strong>Spots Left:</strong> ${course.spotsLeft}</p>
              </div>
              <div class="btn-group class-btn-group">`;
  var teacherBtn = `<button type="button" class="edit-btn btn btn-default btn-md" data-toggle="modal" data-target="#edit-modal" data-id='${course._id}'>edit</button>
                    <button type="button" class="trash-btn btn btn-default btn-md" data-id='${course._id}'>trash</button>`;
  var part3 = `</div>
              </div>`;
  var innerHTML;
  if ($currentId===course.teacher._id){
    innerHTML = part1 + part2 + teacherBtn + part3;
    $teachCourses.prepend(innerHTML);
    $allCourses.prepend(innerHTML);
  } else if (checkEnroll(course)){
    innerHTML = part1 + unenrollBtn + part2 + part3;
    $enrolledCourses.prepend(innerHTML);
    $allCourses.prepend(innerHTML);
  } else if (checkFull(course)){
    innerHTML = part1 + courseFull + part2 + part3;
    $availableCourses.prepend(innerHTML);
    $allCourses.prepend(innerHTML);
  } else {
    innerHTML = part1 + enrollBtn + part2 + part3;
    $availableCourses.prepend(innerHTML);
    $allCourses.prepend(innerHTML);
  }
}

// renders all courses on AJAX response
function renderAll(courses){
  $('.everything').empty();
  courses.forEach(function(course){
      renderOne(course);
    })
  }

// returns boolean if student IS enrolled in a class
function checkEnroll(course){
  for (i=0; i<enrollsArr.length; i++){
    if((enrollsArr[i].user._id === $currentId) && (course._id === enrollsArr[i].course._id)){
      return true;
    }
  }
}

// checks if a course is full or newEnrollment
function checkFull(course){
  if(course.spotsLeft === 0){
    return true;
  }
}

// gets capacity of course in order to set minimum capacity for editing.
function checkCapacity(courseId){
  var course = allCoursesArr.find(function(course){
    return (courseId===course._id);
  })
  var minVal = course.capacity - course.spotsLeft;
  return minVal;
}

function countEnroll(courseId){
  var course = allCoursesArr.find(function(course){
    return (courseId===course._id);
  })
  var enrollments = enrollsArr.filter(function(enroll){
    return (enroll.course._id === course._id);
  })
  return enrollments.length;
};

// on erroneous AJAX call
function onError(){
  console.log("Oh No!");
}
