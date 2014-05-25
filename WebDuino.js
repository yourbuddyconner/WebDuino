// Readings belong to Sensors which belong to Projects
Projects = new Meteor.Collection("projects");
Sensors = new Meteor.Collection("sensors");
Readings = new Meteor.Collection("readings");


if (Meteor.isClient) {
  Template.home.greeting = function () {
    return "Welcome to WebDuino.";
  };

  Template.projects.projects = function () {
    return Projects.find({}, {owner: Meteor.user()}).fetch();
  }
  Template.projects.sensors = function (yolo) {
    return Sensors.find({}, {parentId: yolo});
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
