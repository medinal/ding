
$(document).ready(function(){

  var allCourses = $('.all-courses');
  var teachCourses = $('.teach-courses');
  var availableCourses = $('.available-courses');
  var enrolledCourses = $('.enrolled-courses');


  $.ajax({
    method: "GET",
    url: "/courses",
    success: function(res){
        onSuccess(res);
        res.forEach(function RenderAllCourses(course){
          renderCourse(course, allCourses);
        });
    },
    error: onError
  })







});

var onSuccess = function(res){
  console.log('good job, ajax!');
  console.log(res);
}

var onError = function(){
  console.log('try again, ajax');
}

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
        <div class="btn-group">
          <button type="button" class="edit-btn btn btn-default btn-md" dataId=''>edit</button>
          <button type="button" class="trash-btn btn btn-default btn-md" dataId=''>trash</button>
        </div>
    </div>
    `);
}
