import serial #For communication on the Serial ports
import requests #For making HTTP requests
import json #For JSON decoding
print "Finished imports"

debug = True

#CONFIGURE THESE
project_id = "my_awesome_project_id"
ids = ["pot","xAcc","yAcc","zAcc"]

#ONLY EDIT IF YOU HAVE TO
serial_port = '/dev/tty.usbmodem411'
baud_rate = 115200

##DO NOT EDIT BELOW THIS LINE UNLESS YOU ARE CONFIDENT
#Configuration of Serial ports
print "Configuring Serial port `{0}` at {1} bps...".format(serial_port, baud_rate)
print "Blocking until Serial data is available on {0}".format(serial_port)
ser = serial.Serial(serial_port, baud_rate)
ser.readline()
print "Configured"
try:
	while True: #Loop forever
		raw = ser.readline()[:-2] #Strip the \r\n
		try:
			j = json.loads(raw)
			payload = {}
			for key in ids:
				payload[key] = j.get(key) #Could be None
			r = requests.get('http://webduino.meteor.com/api/{0}'.format(project_id), params=payload)
			if debug: print r.url #The ultimate requests URL
		except ValueError as e:
			if debug: print repr(e) #The error
except Exception as e:
	if debug: print repr(e) #The error
ser.close() #Close the Serial port