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

}); // closes $(document).ready()
