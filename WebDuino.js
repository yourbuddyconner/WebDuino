Projects = new Meteor.Collection("projects");
Readings = new Meteor.Collection("readings");
Sensors = new Meteor.Collection("sensors");

if (Meteor.isClient) {
  Template.home.greeting = function () {
    return "Welcome to WebDuino.";
  };

  Template.projects.projects = function () {
    return Projects.find({}, {owner: Meteor.user()}).fetch();
  }
}

if (Meteor.isServer) { 
    Router.map(function(){
      this.route('accessPoint',{
        path: '/api/:_id',
        action: function(){
          var project = Projects.findOne({_id: this.params._id}).fetch();
          if(project){

          }
        }
      });
    });
}
