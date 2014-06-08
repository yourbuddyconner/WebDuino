// subscribe to the user's projects, sensors, and readings
Meteor.subscribe("projects");
Meteor.subscribe("readings");

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

//Autoform Stuff
AutoForm.addHooks(['insertSensorForm', 'insertProjectForm'], {
  after: {
    insert: function(error, result) {
      if (error) {
        console.log("Insert Error:", error);
      } else {
        console.log("Insert Result:", result);
      }
    },
    update: function(error) {
      if (error) {
        console.log("Update Error:", error);
      } else {
        console.log("Updated!");
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

// Populates and daws graph in the Template.projects
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
    
    // Redraw the graph whenever the window resizes
    function resize () {
      graph = new google.visualization.LineChart(document.getElementById('graph'));
      graph.draw(data, graphOptions);
    }
    window.onresize = resize;
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
    Session.set("currentSensor", {name: event.target.dataset.name, parentProject: event.target.parentNode.parentNode.id})
  },
  'click #addProjectButton': function(){
    $('#projectModal').modal('show')
  },
  'click #addSensorButton': function(event){
    $('#sensorModal').modal('show')
    // This is the best way I can think of to get the id of the parent project
    Session.set("RequestingProject", $(event.target).closest('.accordion-body').attr('id'));
  }
}

// Code to run when certain templates render 
Template.projects.rendered = function(){ 
  Session.set("currentTemplate", "projects")
}
Template.home.rendered = function(){
  Session.set("currentTemplate", "home")
}
