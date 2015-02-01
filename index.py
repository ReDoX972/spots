import os
import slots_spots_algo
import json, ast
import logging
from logging.handlers import RotatingFileHandler

from flask import Flask, request, render_template, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/simulator')
def simulator():
    return render_template('simulator.html')

@app.route('/simulator/execute', methods=['GET','POST'])
def simulator_execute():

	res = {}
	app.logger.warning('Warning')
	app.logger.error('Error')

	if request.method == 'POST':
		json_data_string = json.dumps(request.json, indent=4)
		json_data_dict = ast.literal_eval(json_data_string)

		slot_duration = json_data_dict["slot_duration"]
		data_spots = []
		for spot in json_data_dict["data_spots"]:
			data_spots.append((spot['id'], spot['duration'], spot['value']))
			app.logger.warning(data_spots);

		max_benef, sub_spots = slots_spots_algo.compute_max_benef(data_spots, slot_duration)

		sub_spots_json = []
		for spot in sub_spots:
			sub_spots_json.append({'id' : spot[0], 'duration' : spot[1], 'value' : spot[2]})

		res = {'max_benef': max_benef, 'sub_spots': sub_spots_json}
    
	return jsonify(res)

if __name__ == '__main__':
	handler = RotatingFileHandler('info.log', maxBytes=10000, backupCount=1)
   	app.logger.addHandler(handler)

   	port = int(os.environ.get("PORT", 5000))
   	app.run(host='0.0.0.0', port=port)