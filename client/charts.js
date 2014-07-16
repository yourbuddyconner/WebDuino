// For debugging - Take out later
// Deps.autorun(function(){
//   console.log("Current Sensor: " + Session.get("currentSensor"));
// })
// Deps.autorun(function(){
//   console.log("Current Project: " + Session.get("currentProject"));
// })

/*
  This will pull out all relevant sensor data for a project from mongo and feed it
  into a google chart dashboard. All charts for a project will be displayed at once
  and data will be customizable. 

  WARNING: Janky Code Ahead (for now)

  The graph relies on multiple Session variables:
    "NumberOfReadings"
*/
Deps.autorun(function() {
  if(Session.get("currentTemplate") == "projects" && Session.get("currentProject")){
    if(!Session.get("GraphIsSetup")){

    } 
  }
  if(Session.get("currentTemplate") == "projects" && Session.get("currentProject") && Session.get("currentSensor")){
    // Set all the variables if we havent set up the graph yet
    if(!Session.get("GraphIsSetup")){
      // show graph options and hide the "No Sensor" text
      $(".graphOptions").toggleClass("hidden");
      $("#noSensor").toggleClass("hidden");
      // graph is ready
      Session.set("GraphIsSetup", true);
      //console.log("Seting up the graph!")
      graph = new google.visualization.LineChart(document.getElementById('graph'));
      graphOptions = {
        height: 250,
        curveType: 'function',
        animation:{
          duration: 1000,
          easing: 'out'
        },
        legend: { position: 'bottom' },
        hAxis: {
          format: "h:mm a"
        }
      }
    }
    var currentProject, currentSensor = {}, readings, nameArray = [];

    currentProject = Session.get("currentProject");
    currentSensor = Session.get("currentSensor");
    readings = Readings.find({parentSensor: currentSensor.parentSensor}, {limit: Session.get("NumberOfReadings")}).fetch();
    data = new google.visualization.DataTable(); 

    /* 
      The array of Objects that comes out of Meteor.find needs to be 
      transformed into a table of integers that GCharts understands 

      Looks like this:
        [
        ["Time", "Readings"],
        [Date, int],
        [Date, int],
        ...
        ]

      Note - Currently we only support two fixed axies, this could change later
    */

    data.addColumn({
      type: "date",
      label: "Timestamp",
    });
    data.addColumn({
      type: "number",
      label: "Readings"
    });
    
    if(readings.length > 0) {
      //console.log("Readings is greater than zero", readings);
      // make sure only the stuff we want to display is showing
      $("#graph").show();
      $(".graphOptions").show();
      $("#noData").hide();
      
      for (var i = 0; i<readings.length; i++){
        //console.log([readings[i].timestamp, readings[i].data]);
        data.addRow([readings[i].timestamp, readings[i].data]);
      }
      console.log(data);
      graph.draw(data, graphOptions);
    }
    else if(readings.length == 0){
      $('#graph').hide();
      $("#noData").show();
      $(".graphOptions").hide();
    }
    else{
      console.log("I shouldn't care what readings is.")
      $('#graph').hide();
    }

    // Redraw the graph whenever the window resizes
    window.onresize = graph.draw(data, graphOptions);
  }
});