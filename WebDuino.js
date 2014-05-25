// Readings belong to Sensors which belong to Projects
Projects = new Meteor.Collection("projects");
Sensors = new Meteor.Collection("sensors");
Readings = new Meteor.Collection("readings");


if (Meteor.isClient) {
  Template.projects.projects = function () {
    return Projects.find({owner: Meteor.user()}).fetch();
  }
  Template.projects.sensors = function (parent) {
    return Sensors.find({parentId: parent.hash.parent});
  }
  Template.projects.sensorData = function (parent) {
    return Readings.find({parentId: parent.hash.parent}).fetch();
  }
  Template.projects.events = {
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
          parentId: parent,
          name: sensorName.val(),
          sensorType: sensorType.val(),
          pins: pins.val().split(" ").map(function(x){return parseInt(x)})
        });
      }
    }
  }
  Template.createProject.events = {
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
  Template.graph.data = function () {
    alert(parentId);
  }
}

if (Meteor.isServer) { 
    Router.map(function(){
      this.route('accessPoint',{
        path: '/api/:_id', // expects a project ID
        where: 'server',
        action: function(){
          var project = Projects.findOne({_id: this.params._id}); //find the corresponding project
          if(project){
            var sensorArray = Sensors.find({}, {parentId: this.params._id}).fetch(); // An array of Sensors that belong to the project
            var time = new Date();
            var params = this.params;
            for (var i =0 ; i < sensorArray.length; i++) {
              var theID = sensorArray[i]._id
              var newReading = {
                parentId: sensorArray[i]._id,
                timestamp: time,
                data: [this.params[theID]]
              };
              Readings.insert(newReading); 
            };//end for
          }
          return "Thank you!"
        }
      });//end route
    });
}
