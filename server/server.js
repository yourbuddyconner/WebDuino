Meteor.startup(function(){
  // Readings belong to Sensors which belong to Projects
  Projects = new Meteor.Collection("projects");
  Sensors = new Meteor.Collection("sensors");
  Readings = new Meteor.Collection("readings");
});

// Publish the user's projects, sensors, and readings to them 
Meteor.publish("projects", function(){
  return Projects.find({owner: Meteor.user()});
});
Meteor.publish("sensors", function(){
  return Sensors.find({owner: Meteor.user()});
});
Meteor.publish("readings", function(){
  return Readings.find({owner: Meteor.user()});
});

// Our API access point for the moment
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

