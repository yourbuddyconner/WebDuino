// subscribe to the user's projects, sensors, and readings
Meteor.subscribe("projects");
Meteor.subscribe("sensors");
Meteor.subscribe("readings");

/*
  DB Schema: 
    Projects {
      _id: String,
      owner: Meteor.user
      name: String
    }

    Sensors {
      _id: String,
      ParentID: Project._id,
      name: String,
      sensorType: String,
      pins: [int]
    }

    Readings {
      _id: String,
      parentID: Sensor,
      timestamp: int,
      data: [int] <-- corresponds to order in Sensors.pins
    }
*/

Template.projects.projects = function () {
  return Projects.find({owner: Meteor.user()}).fetch();
}
Template.projects.sensors = function (parent) {
  return Sensors.find({parentId: parent.hash.parent});
}
Template.projects.sensorData = function (parent) {
  return Readings.find({parentId: parent.hash.parent}).fetch();
}
Template.projects.sensorId = function (id) {
  return {_id: id};
}
Template.projects.events = {
  // Logic for the form validation
  // TODO: Move this over to a valiation package
  'click button': function(e){
    var parent = $(e.target).parent().attr("id");
    var sensorName = $("#sensor_form_name_" + parent);
    var sensorType = $("#sensor_form_type_" + parent)
    var pins = $("#sensor_form_pins_" + parent);
    console.log(sensorName.val());
    if (sensorName.val() == ""){
      sensorName.parent().toggleClass("error");
      alert("Please input a sensor name.");
    }
    else{
      Sensors.insert({
        owner: Meteor.user(),
        parentId: parent,
        name: sensorName.val(),
        sensorType: sensorType.val(),
        pins: pins.val().split(" ").map(function(x){return parseInt(x)})
      });
    }
  }
}
Template.createProject.events = {
  // Logic for the form validation
  // TODO: Move this over to a valiation package
  'click button': function(e){
    e.preventDefault();
    var field = $('#project_name');
    if (field.val() == ""){
      field.parent().parent().toggleClass("error");
      alert("Please input a project name.");
    }
    else if(Projects.find({owner: Meteor.user(), name: field.val()}).fetch() != 0){
      field.parent().parent().toggleClass("error");  
      alert("You already have a project by that name, choose another.");           
    }
    else{
      Projects.insert({
        owner: Meteor.user(),
        name: field.val()
      });
      field.parent().parent().toggleClass("success");
      field.val("");
    }
  }
};

