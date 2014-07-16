// subscribe to the user's projects, sensors, and readings
Meteor.subscribe("projects");
Meteor.subscribe("readings");
Meteor.subscribe("sensors");

// Client-Side Routes
Router.map(function () {
  this.route('main', {
    path: '/'
  });
});

// set all the session variables we'll rely on later
Meteor.startup(function(){
  Session.set("GraphIsSetup", false);
});

// Set the current user to the session
Deps.autorun(function(){
  if (Meteor.user())
    Session.set("currentUser", Meteor.user()._id);
});

//Autoform Debugging Code
AutoForm.addHooks(['insertSensorForm', 'insertProjectForm'], {
  after: {
    insert: function(error, result) {
      if (error) {
        console.log("Insert Error:", error);
      } else {
        console.log("Insert Result:", result);
      }
    },
    update: function(error, result) {
      if (error) {
        console.log("Update Error:", error);
      } else {
        console.log("Updated!", result);
      }
    },
    remove: function(error) {
      console.log("Remove Error:", error);
    }
  }
});


// 'Projects' template helpers
Template.projects.projects = function () {
  return Projects.find({owner: Session.get("currentUser")});
}
Template.projects.sensors = function (parent) {
  return Sensors.find({parentProject: parent.hash.parent});
}
Template.projects.sensorId = function (id) {
  return {_id: id};
} 
Template.projectModals.requestingSensor = function() {
  if(Session.get("RequestingProject"))
    return Projects.findOne({_id: Session.get("RequestingProject")}).name;
  else
    return
}
Template.projects.helpers({
  projectFormSchema: function(){
    return Schemas.project;
  },
  insertSensorDoc: function(){
    console.log(Projects.findOne({_id: Session.get('RequestingProject')}))
    return Projects.findOne({_id: Session.get('RequestingProject')});
  },
  currentUser: function(){
    return Session.get('currentUser')._id;
  }
});
Template.projects.events = {
  'click .accordion-toggle': function(event){
    if($("#" + event.target.dataset.id).hasClass("accordion-body")){
      Session.set("currentProject", event.target.dataset.id)
    }
    else{
    }
    //console.log(event.target.dataset.id);
    //console.log(event.target);
  },
  'click .sensor': function(event){
    /* Session.get("currentSensor") contains an object:
      {
        name: String,
        parentProject: String
      }
    */
    if (event.target.tagName != "DIV"){
      event.target = event.target.parentNode;
    }
    Session.set("currentSensor", {parentSensor: event.target.dataset.id, name: event.target.dataset.name})
  },
  'click #addProjectButton': function(){
    $('#projectModal').modal('show')
  },
  'click #addSensorButton': function(event){
    $('#sensorModal').modal('show')
    // This is the best way I can think of to get the id of the parent project
    Session.set("RequestingProject", $(event.target).closest('.accordion-body').attr('id'));
  },
  'click #submitSensor': function(){
    var newSensorName = $('#newSensorForm').children().children("#sensorName");
    var newSensorType = $('#newSensorForm').children().children("#sensorType");
    if(newSensorName.val() && newSensorType.val()){
      if(Sensors.findOne({name: newSensorName.val()}) != undefined){
        console.log("Already have one by that name!")
        newSensorName.parent().addClass("error");
        $("#sensorHelpText").html("You already have a sensor by that name!")
        Session.set("SensorFormError", true);
      }
      else{
        if(Session.get("SensorFormError")){
          newSensorName.parent().removeClass('error');
          $("#sensorHelpText").html("");
          Session.set("SessionFormError", false);
        }
        newSensor = {
          parentProject: Session.get("RequestingProject"),
          name: newSensorName.val(),
          type: newSensorType.val()
        }
        Sensors.insert(newSensor);
        $('#sensorModal').modal('hide')
        newSensorName.val("");
        newSensorType.val("");
        console.log("Submitted!");
      }
    }
  },
  'click #submitProject': function(){
    var newProjectName = $('#newProjectForm').children().children("#projectName");
    if(newProjectName.val()){
      if(Projects.findOne({name: newProjectName.val(), owner: Session.get("currentUser")}) != undefined){
        console.log("Already have a project by that name!")
        newProjectName.parent().addClass("error");
        $("#projectHelpText").html("You already have a project by that name!")
        Session.set("ProjectFormError", true);
      }
      else{
        if(Session.get("ProjectFormError")){
          newProjectName.parent().removeClass('error');
          $("#projectHelpText").html("");
          Session.set("ProjectFormError", false);
        }
        newProject = {
          name: newProjectName.val(),
          owner: Session.get("currentUser")
        }
        Projects.insert(newProject);
        $('#projectModal').modal('hide')
        newProjectName.val("");
        console.log("Submitted!");
      }
    }
  }
}

// Code to run when certain templates render 
Template.projects.rendered = function(){ 
  Session.set("currentTemplate", "projects")
  Session.set("NumberOfReadings", 20);
  $("#numberOfReadings").change(function(){
    Session.set("NumberOfReadings", parseInt($("#numberOfReadings").val()));
    console.log($("#numberOfReadings").val());
  })
}
Template.home.rendered = function(){
  Session.set("currentTemplate", "home")
}
