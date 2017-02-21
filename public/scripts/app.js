// client/dashboard ~ app.js

// GLOBALS
var allCoursesArr = [];

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

  $currentId = $('.user').data('id')

  // SUBMIT A NEW CLASS
  $('.add-class').on('submit', function(e){
    e.preventDefault();
    $('.user-id').val($currentId);
    $('#add-modal').modal('toggle');
    var data = $('.add-class').serialize();
    $('.add-class')[0].reset();
    $.ajax({
      method: "POST",
      url: "/courses",
      data: data,
      success: populateData,
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
      var course = allCoursesArr.find(function(course){
                    return (thisId === course._id);
                  });
      $('.edit-course-name').val(course.name);
      $('.edit-course-description').val(course.description);
      $('.course-capacity').val(course.capacity);
      var minCapacity = checkCapacity(thisId);
      $('.course-capacity').attr("min", minCapacity);
      $('.course-id').val(thisId);
    });

    // UPDATE A CLASS
    $('.edit-class').on('submit', function(e){
      e.preventDefault();
      var newCapacity = $('.course-capacity').val()
      var thisId = $('.course-id').val();
      $('#edit-modal').modal('toggle');
      var data = $('.edit-class').serialize();
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
  $('#accordion').ready(function(){
    populateData();
  });

}); // closes $(document).ready()

// FUNCTIONS OUTSIDE PAGE LOAD

// pulls important data from server & sends to render
function populateData(){
  var counter = 0;
  var data = {
    userId: $currentId
  }
    $.ajax({
      method: "GET",
      url: "/courses",
      data: data,
      success:
      function(courses){
        courses.forEach(function(course){
          delete course.teacher._id
        })
        allCoursesArr = [];
        allCoursesArr = courses;
        renderAll(allCoursesArr);
      },
      error: onError
    });
  };


// renders a single course to views/index.html
function renderOne(course){
  var part1 = `<hr>
              <div class="course-panel container-fluid">
              <div class="course-title clearfix">
              <div>`;
  var enrollBtn = `<button class="enroll-btn btn btn-lg btn-success" type="button" name="enroll" data-id="${course._id}">Enroll me</button>`;
  var courseFull = `<img class="class-full-img" src="images/class_full.jpg" alt="Course Full!">`
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
  if (course.isTeacher){
    innerHTML = part1 + part2 + teacherBtn + part3;
    $teachCourses.prepend(innerHTML);
    $allCourses.prepend(innerHTML);
  } else if (course.isEnroll){
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


// on erroneous AJAX call
function onError(){
  console.log("Oh No!");
}
