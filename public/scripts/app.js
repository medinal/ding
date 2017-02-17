//client side ~ app.js

$(document).ready(function(){

  // ID# of current user (0 for default on page load)
  var $currentId = 0;
  // Arrays populated on Ajax response.
  var allCoursesArr = [];
  var teachArr = [];
  var enrollsArr = [];
  var availableArr = [];
  // jQuery Variables
  var $allCourses = $('.all-courses');
  var $teachCourses = $('.teach-courses');
  var $availableCourses = $('.available-courses');
  var $enrolledCourses = $('.enrolled-courses');

  // ON USER SELECT: Displays classes taught by current user
  var showTeaching = function(){
    teachArr = [];
    allCoursesArr.filter(Teaching);
    renderCoursesByUser(teachArr);
  }
  // ON USER SELECT: Displays classes enrolled by current user
  var showEnrolled = function(){
    enrollsArr = [];
    console.log('enrollsArr: ', enrollsArr);
  }
  // ON USER SELECT: Displays classes enrolled by current user
  var showAvailable = function(){
    availableArr = [];
    allCoursesArr.filter(Available);
    renderCoursesByUser(availableArr);
  }


  // Dropdown Event Listener
  $('.user-dropdown').on('click', '.dropdown-item', function(){
    $('.courses').empty();
    $currentId = $(this).attr('data-id');
    showTeaching();
  }); // closes '.user-dropdown' event listener



  // USER LIST AJAX
  $.ajax({
    method: "GET",
    url: "/users",
    success: function(res){
      //onSuccess(res);
      res.forEach(function RenderAllUsers(user){
        renderUser(user);
      });
    }
  }); // closes '/users' ajax
  // COURSE LIST AJAX
  $.ajax({
    method: "GET",
    url: "/courses",
    success: function(res){
        //onSuccess(res);
        res.forEach(function RenderAllCourses(course){
          allCoursesArr.push(course);
          renderCourse(course, $allCourses);
        });
        renderCoursesByUser();
      },
    error: onError
  }); // closes '/courses' ajax
  // ENROLLMENT LIST AJAX
  $.ajax({
    method: "GET",
    url: "/enrolls",
    success: function(res){
      onSuccess(res);
    },
    error: onError
  }); // closes '/enrolls' ajax



  // TODO: Sorts 'Courses' by user for 'Courses Available'
  var Available = function(course){}
  // TODO: Sorts 'Courses' by user for 'Courses Enrolled'
  var Enrolled = function(userId, courseId){}





  // Sorts 'Courses' by user for 'Courses Teaching'
  var Teaching = function(course){
    if(course.teacher._id == $currentId){
      teachArr.push(course);
    }
  };
  // filters ALL COURSES to populate other course lists
  var renderCoursesByUser = function(arr){
    if ($currentId === 0){
      renderDefault($teachCourses);
      renderDefault($availableCourses);
      renderDefault($enrolledCourses);
    } else {
      $('.courses').empty();
      arr.forEach(function(course){
        renderCourse(course, $teachCourses);
      });
    }
  };
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
      <button class="enroll-btn btn btn-lg btn-danger" type="button" name="enroll" data-id="${res._id}">Enroll me</button>
      <h3>${res.name}</h3>
      <br>
      <p><strong>Taught by:</strong>  ${res.teacher.name}</p>
      <p><strong>Description:</strong>  ${res.description}</p>
      <p><strong>Capacity:</strong>  ${res.capacity}</p>
      </div>
      <div class="btn-group class-btn-group">
      <button type="button" class="edit-btn btn btn-default btn-md" dataId='${res._id}'>edit</button>
      <button type="button" class="trash-btn btn btn-default btn-md" dataId='${res._id}'>trash</button>
      </div>
      </div>
      `);
    }
  // Renders default HTML panel for empty course lists
  var renderDefault = function(div){
      $(div).prepend(`
        <hr>
        <div class="default-panel container-fluid">
        <h3>Any future applicable classes will appear here!<h3>
        `);
      }

});  // closes (document).ready()
