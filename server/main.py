#!/usr/bin/python

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/updateShutters', methods = ['PATCH'])
def shutters():
    channel = request.json['channel']
    action = request.json['action']

    if channel and action is None:
        result = "Parameters not set!"
    else:
        result = "Button pressed! Channel: " + str(channel) + ' Action: ' + action

    response = jsonify({'result': result})
    return response

app.run(debug=True)