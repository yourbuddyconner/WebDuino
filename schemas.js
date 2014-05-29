Projects = new Meteor.Collection("projects");
Sensors = new Meteor.Collection("sensors");
Readings = new Meteor.Collection("readings");

var Schemas = {};

Schemas.project = new SimpleSchema({
  _id: {
    type: String,
    label: "_id"
  },
  name: {
    type: String,
    label: "Name"
  }
  owner: {
    type: Object,
    label: "Owner"
  }
});
Schemas.sensor = new SimpleSchema({
  _id: {
    type: String,
    label: "_id"
  },
  name: {
    type: String,
    label: "Name"
  },
  owner: {
    type: Object,
    label: "Owner"
  },
  parentProject: {
    type: Schemas.project,
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
  _id: {
    type: String,
    label: "_id"
  },
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
    type: [int],
    label: "values passed from the Arduino"
  }
});

Projects.attachSchema(Schemas.project);
Sensors.attachSchema(Schemas.sensor);
Readings.attachSchema(Schemas.reading);
