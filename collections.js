Projects = new Meteor.Collection("projects");
//Sensors = new Meteor.Collection("sensors");
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
      try{
        //return Meteor.user()._id;
      }
      catch(e){
        console.log(e);
        return ""
      }
    }
  },
  sensors: {
    type: [Object],
    minCount: 0,
    optional: true
  },
  "sensors.$.name": {
    type: String
  },
  "sensors.$.type": {
    type: String
  }
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
Readings.attachSchema(Schemas.reading);
