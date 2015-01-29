import os
import slots_spots_algo

from flask import Flask
from flask import render_template
from flask import jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/simulator')
def simulator():
    return render_template('simulator.html')

@app.route('/simulator/execute')
def simulator_execute():

	# TODO : parse JSON to list
	data_spots = [(0,20,25),(1,20,25),(2,70,65),(3,10,15),(4,10,5),(5,40,35),(6,10,15),(7,80,75),(8,10,15),(9,40,45)]
	slot_duration = 100;

	max_benef, sub_spots = slots_spots_algo.compute_max_benef(data_spots, slot_duration)

	res = {'max_benef': max_benef, 'sub_plots': sub_spots}
    

	# TODO : parse returned list (sub_plots) to JSON
	return jsonify(res)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
    app.run()