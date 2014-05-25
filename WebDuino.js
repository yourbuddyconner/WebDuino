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
  Template.projects.sensors = function () {
    return Sensors.find({}, {parentId: Projects.find({}, {owner: Meteor.user()})});
  }
}

if (Meteor.isServer) { 
    Router.map(function(){
      this.route('accessPoint',{
        path: '/api/:_id',
        action: function(){
          var project = Projects.findOne({_id: this.params._id}).fetch();
          if(project){
            Readings.insert({

            })
          }
        }
      });
    });
}
