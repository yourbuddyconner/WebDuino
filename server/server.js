// Publish the user's projects, sensors, and readings to them 
Meteor.publish("projects", function(){
  return Projects.find({owner: this.userId});
});
Meteor.publish("readings", function(){
  return Readings.find({owner: this.userId});
});

Meteor.methods({
  // expects an object with a name field
  insertProject: function(doc){
    Schemas.project.clean(doc);     //clean the object coming from autoform
    check(doc, Schemas.project);    //check it against the schema
    if (this.userId){               //if there is a user logged in
      var newProject = {
        name: doc.name,
        owner: this.userId
      }
      console.log("The new project object: ")
      console.log(newProject);
      Projects.insert(newProject);
      return true;
    }
    return false;
  }
});

Router.map(function(){
  this.route('accessPoint',{
    path: '/api/:_id', // expects a project ID
    where: 'server',
    action: function(){
      var project = Projects.findOne({_id: this.params._id}); //find the corresponding project
      if(project){
        var time = new Date();
        var params = this.params;
        var theID = project.sensors[this.params.sensorIndex]
        var newReading = {
          parentProject: this.params._id,
          timestamp: time,
          data: params.data
        };
        Readings.insert(newReading); 
        };//end for
      }
  });
});

