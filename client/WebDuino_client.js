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
  Session.set("currentUser", Meteor.user());
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
// For debugging - Take out later
// Deps.autorun(function(){
//   console.log("Current Sensor: " + Session.get("currentSensor"));
// })
// Deps.autorun(function(){
//   console.log("Current Project: " + Session.get("currentProject"));
// })

/*
  Populates and daws graph in the Template.projects
  WARNING: Janky Code Ahead

  The graph relies on multiple Session variables:
    "NumberOfReadings"
*/
Deps.autorun(function() {
  if(Session.get("currentTemplate") == "projects" && Session.get("currentProject") && Session.get("currentSensor")){
    // Set all the variables if we havent set up the graph yet
    if(!Session.get("GraphIsSetup")){
      // show graph options and hide the "No Sensor" text
      $(".graphOptions").toggleClass("hidden");
      $("#noSensor").toggleClass("hidden");
      // set default number of readings to show
      Session.set("NumberOfReadings", 15);
      // graph is ready
      Session.set("GraphIsSetup", true);
      //console.log("Seting up the graph!")
      graph = new google.visualization.LineChart(document.getElementById('graph'));
      data = null; 
      graphOptions = {
        height: 250,
        animation:{
          duration: 1000,
          easing: 'out',
        }
      }
    }
    var currentProject, currentSensor = {}, readings, dataArray = [], nameArray = [];

    currentProject = Session.get("currentProject");
    currentSensor = Session.get("currentSensor");
    readings = Readings.find({parentSensor: currentSensor.parentSensor}, {sort: {timestamp: -1}, limit: Session.get("NumberOfReadings")}).fetch();
    // Currently we only support two fixed axies, this could change later
    dataArray.push(["Time", "Readings"])
    //console.log(readings);

    /* 
      The array of Objects that comes out of Meteor.find needs to be 
      transformed into a table of integers that GCharts understands 
    */
    if(readings.length > 0){
      for (var i = 0; i<readings.length; i++){
        dataArray.push([readings[i].timestamp, readings[i].data]);
      }
    }
    else{
      console.log(readings);
    }
    //console.log(dataArray);
    //console.log("I'm drawing it !");
    data = google.visualization.arrayToDataTable(dataArray);
    
    function draw () {
      graph.draw(data, graphOptions);
    }
    draw();
    // Redraw the graph whenever the window resizes
    window.onresize = draw;
  }
});

// 'Projects' template helpers
Template.projects.projects = function () {
  return Projects.find({owner: Session.get("currentUser")._id});
}
Template.projects.sensors = function (parent) {
  return Sensors.find({parentProject: parent.hash.parent});
}
Template.projects.sensorId = function (id) {
  return {_id: id};
} 
Template.projectModals.requestingSensor = function() {
  return Session.get("RequestingProject");
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
        console.log("Submitted!");
      }
    }
  }
}

// Code to run when certain templates render 
Template.projects.rendered = function(){ 
  Session.set("currentTemplate", "projects")
}
Template.home.rendered = function(){
  Session.set("currentTemplate", "home")
}
