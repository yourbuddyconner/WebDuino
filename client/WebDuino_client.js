// subscribe to the user's projects, sensors, and readings
Meteor.subscribe("projects");
Meteor.subscribe("readings");

Deps.autorun(function(){
  // set the current user to the session
  Session.set("currentUser", Meteor.user());
});

Template.projects.projects = function () {
  return Projects.find({owner: Session.get("currentUser")._id});
}
Template.projects.sensorData = function (parent) {
  return Readings.find({parentId: parent.hash.parent}).fetch();
}
Template.projects.sensorId = function (id) {
  return {_id: id};
}

//Template Helper Functions 
Template.projects.helpers({
  projectFormSchema: function(){
    return Schemas.project;
  }
});

//Template event handlers
// Template.projects.events = {
//   'click .projectContainer' : function(event){
//     $(event.target).collapse('toggle');
//   }
// };

//Template render code
Template.projects.rendered = function(){ 
  window.setTimeout(300);
  var proj = $(".project");
  var labels = $(".projectLabel");
  var targ;
  for (var i=0; i<labels.length; i++){
    targ = "project-"+i;
    //set up the projects' ids
    proj[i].id = targ;
  
    // This is super dirty, but it works. Fix it later.
    labels[i].setAttribute("onclick", "$('#project-" + i + "').collapse('toggle')");
  }
}
// Template.projects.events = {
//   // Logic for the form validation
//   // TODO: Move this over to a valiation package
//   'click button': function(e){
//     var parent = $(e.target).parent().attr("id");
//     var sensorName = $("#sensor_form_name_" + parent);
//     var sensorType = $("#sensor_form_type_" + parent)
//     var pins = $("#sensor_form_pins_" + parent);
//     console.log(sensorName.val());
//     if (sensorName.val() == ""){
//       sensorName.parent().toggleClass("error");
//       alert("Please input a sensor name.");
//     }
//     else{
//       Sensors.insert({
//         owner: Meteor.user(),
//         parentId: parent,
//         name: sensorName.val(),
//         sensorType: sensorType.val(),
//         pins: pins.val().split(" ").map(function(x){return parseInt(x)})
//       });
//     }
//   }
// }
// Template.createProject.events = {
//   // Logic for the form validation
//   // TODO: Move this over to a valiation package
//   'click button': function(e){
//     e.preventDefault();
//     var field = $('#project_name');
//     if (field.val() == ""){
//       field.parent().parent().toggleClass("error");
//       alert("Please input a project name.");
//     }
//     else if(Projects.find({owner: Meteor.user(), name: field.val()}).fetch() != 0){
//       field.parent().parent().toggleClass("error");  
//       alert("You already have a project by that name, choose another.");           
//     }
//     else{
//       Projects.insert({
//         owner: Meteor.user(),
//         name: field.val()
//       });
//       field.parent().parent().toggleClass("success");
//       field.val("");
//     }
//   }
// };

