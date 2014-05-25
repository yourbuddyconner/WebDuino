/**
 * Customize these variables 
 *
 */
int pins[] = {A0, A1, A2, A3}; //Analog input pins
String ids[] = {"pot","xAcc","yAcc","zAcc"}; //Sensor names
int numPins = 4;
/* End customization */

//Executed once
void setup() 
{
  Serial.begin(115200); //baud rate, in bits per second. If you change this value, make sure to change the corresponding value in the Python script
}

//Executed over and over
void loop() 
{
  //Do some string shenanigans to construct the JSON string
  String json = "{";
  for (int i = 0; i < numPins; ++i) {
    json += "\"" + ids[i] + "\":"+String(analogRead(pins[i]))+","; //Ugly
  }
  json = json.substring(0, json.length() - 1);
  json += "}";
  
  Serial.println(json); //Output the data to the Serial port
  delay(1000); //Wait one second between updates. Change this value at your own risk
}
