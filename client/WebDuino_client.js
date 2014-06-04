// subscribe to the user's projects, sensors, and readings
Meteor.subscribe("projects");
Meteor.subscribe("readings");

// Client-Side Routes
Router.map(function () {
  this.route('main', {
    path: '/'
  });
});

Meteor.startup(function(){
  Session.set("GraphIsSetup", false)
});

Deps.autorun(function(){
  // set the current user to the session
  Session.set("currentUser", Meteor.user());
});

// Deps.autorun(function(){
//   console.log("Current Sensor: " + Session.get("currentSensor"));
// })
// Deps.autorun(function(){
//   console.log("Current Project: " + Session.get("currentProject"));
// })
// Populates the graph in the 'Projects' template
Deps.autorun(function() {
  if(Session.get("currentTemplate") == "projects" && Session.get("currentProject") && Session.get("currentSensor")){
    if(!Session.get("GraphIsSetup")){
      $(".graphOptions").toggleClass("hidden")
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
    readings = Readings.find({parentProject: currentProject, sensorName: currentSensor.name}).fetch();
    dataArray.push(["Time", "Readings"])
    //console.log(readings);
    for (var i = 0; i<25; i++){
      dataArray.push([readings[i].timestamp, readings[i].data]);
    }
    //console.log(dataArray);
    //console.log("I'm drawing it !");
    data = google.visualization.arrayToDataTable(dataArray);
    graph.draw(data, graphOptions);
  }
  else{

  }
});

// 'Projects' template helpers
Template.projects.projects = function () {
  return Projects.find({owner: Session.get("currentUser")._id});
}
Template.projects.sensorData = function (parent) {
  return Readings.find({parentId: parent.hash.parent}).fetch();
}
Template.projects.sensorId = function (id) {
  return {_id: id};
} 
Template.projects.helpers({
  projectFormSchema: function(){
    return Schemas.project;
  }
});
Template.projects.events = {
  'click .accordion-toggle': function(event){
    if(!$("#" + event.target.dataset.id).hasClass("in")){
      Session.set("currentProject", event.target.dataset.id)
    }
    else{
      Session.set("currentProject", null);
      Session.set("currentSensor", null)
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
    Session.set("currentSensor", {name: event.target.dataset.name, parentProject: event.target.parentNode.parentNode.id})
  }
}

// Code to run when certain templates render 
Template.projects.rendered = function(){ 
  Session.set("currentTemplate", "projects")
}
Template.home.rendered = function(){
  Session.set("currentTemplate", "home")
}
