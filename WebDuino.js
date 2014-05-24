Projects = new Meteor.Collection("projects");

if (Meteor.isClient) {
  Template.home.greeting = function () {
    return "Welcome to WebDuino.";
  };

  Template.projects.projects = function () {
    return Projects.find({}, {owner: Meteor.user()}).fetch();
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
