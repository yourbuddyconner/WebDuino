Projects = new Meteor.Collection("projects");
Sensors = new Meteor.Collection("sensors");
Readings = new Meteor.Collection("readings");

// THE LINE BELOW SHOULD BE COMMENTED OUT!
//SimpleSchema.debug = true;

Schemas = {};

Schemas.project = new SimpleSchema({
  name: {
    type: String,
    label: "Name"
  },
  owner: { //<-- This gets inserted manually in Meteor.methods
    type: String,
    label: "Owner",
    autoValue: function() {
      if(Meteor.isServer){
        console.log(Meteor.user());
        return Meteor.user()._id;
      }
      else{
        return Session.get("currentUser")._id;
      }
    }
 }
});
Schemas.sensor = new SimpleSchema({
  name: {
    type: String,
    label: "Name"
  },
  owner: {
    type: Object,
    label: "Owner"
  },
  parentProject: {
    type: String
  },
  sensorType: {
    type: String,
    label: "Sensor Type"
  }
  // Implement this later, no need for it right now though
  // pins: {
  //   type: [int],
  // }
});
Schemas.reading = new SimpleSchema({
  // _id: {
  //   type: String,
  //   label: "_id"
  // },
  name: {
    type: String,
    label: "Name"
  },
  owner: {
    type: Object,
    label: "Owner"
  },
  parentSensor: {
    type: Schemas.sensor,
    label: "sensor this reading belongs to"
  },
  timestamp: {
    type: Date,
    label: "when this reading was saved to the database"
  },
  data: {
    type: [Number],
    label: "values passed from the Arduino"
  }
});

Projects.attachSchema(Schemas.project);
Sensors.attachSchema(Schemas.sensor);
Readings.attachSchema(Schemas.reading);
