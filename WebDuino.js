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
        path: '/api/:_id',
        action: function(){
          var project = Projects.findOne({_id: this.params._id}).fetch();
          if(project){
            Sensors = Sensors.find({}, {parentId: project._id}).fetch(); // An array of Sensors that belong to the project
            Readings.insert({

            })
          }
        }
      });
    });
}
