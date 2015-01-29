import os
import slots_spots_algo

from flask import Flask

app = Flask(__name__)

@app.route('/')
def runslotsspots():
    return 'Hello World! runslotsspots'

@app.route('/slots')
def slots():
    return 'Slots spots alog result ' + str(slots_spots_algo.compute_best_gain(4))

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
    app.run()