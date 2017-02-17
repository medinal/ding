var $currentId;


$(document).ready(function(){
  // jQuery Variables
  var allCourses = $('.all-courses');
  var teachCourses = $('.teach-courses');
  var availableCourses = $('.available-courses');
  var enrolledCourses = $('.enrolled-courses');


  // USER LIST AJAX
  $.ajax({
    method: "GET",
    url: "/users",
    success: function(res){
      onSuccess(res);
      res.forEach(function RenderAllUsers(user){
        renderUser(user);
      });
    }
  }); // closes '/users' ajax

  // CLASS LIST AJAX
  $.ajax({
    method: "GET",
    url: "/courses",
    success: function(res){
        res.forEach(function RenderAllCourses(course){
          renderCourse(course, allCourses);
        });
        res.forEach(function RenderCoursesTeaching(course){
          filterByTeacher();
          //renderCourse(course, teachCourses);
        })
    },
    error: onError
  }); // closes '/courses' ajax


  // TODO : FILTER COURSES BY TEACHER
  var filterByUser = function(){
    $currentId = $(this).attr('data-id');
    console.log('currentId: ', $currentId);
    if($currentId === res.teacher._id){
      console.log(res.name);
      //renderCourse(course, teachCourses);
    }
  }
  $('.user-dropdown').on('click', '.dropdown-item', filterByUser);


});  // closes (document).ready()





// Runs on successful ajax call
var onSuccess = function(res){
  console.log('good job, ajax!');
  console.log(res);
}

// Runs on erronous ajax call
var onError = function(){
  console.log('try again, ajax');
}

// Renders User to Dropdown Menu
var renderUser = function(res){
  $('.user-dropdown').append(`
    <a class="dropdown-item" href="#" data-id="${res._id}">${res.name}</a>`)
  }

// Renders courses to 'views/index.html'
var renderCourse = function(res, div){
  $(div).prepend(`
    <hr>
    <div class="course-panel container-fluid">
        <div class="course-title clearfix">
          <button class="btn btn-lg btn-danger" type="button" name="enroll">Enroll me</button>
          <h3>${res.name}</h3>
          <br>
          <p><strong>Taught by:</strong>  ${res.teacher.name}</p>
          <p><strong>Description:</strong>  ${res.description}</p>
          <p><strong>Capacity:</strong>  ${res.capacity}</p>
        </div>
        <div class="btn-group class-btn-group">
          <button type="button" class="edit-btn btn btn-default btn-md" dataId=''>edit</button>
          <button type="button" class="trash-btn btn btn-default btn-md" dataId=''>trash</button>
        </div>
    </div>
    `);
}
