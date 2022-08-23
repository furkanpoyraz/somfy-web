#!/usr/bin/python

from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

@app.route('/channels', methods = ['GET'])
def getChannels():
    file = open("channels.json", "r")
    data = json.load(file)
    file.close()

    return data

@app.route('/channels', methods = ['DELETE'])
def deleteChannel():
    channelID = request.json['channelID']

    file = open("channels.json", "r")
    data = json.load(file)
    file.close()

    channels = data['channels']

    for i, channel in enumerate(channels):
        if channel['id'] == channelID:
            channels.pop(i)

    file = open("channels.json", "w+")
    file.write(json.dumps(data))
    file.close()

    response = jsonify({"result": "channel removed successfully"})

    return response

@app.route('/shutters', methods = ['PATCH'])
def setShutters():
    channel = request.json['channel']
    action = request.json['action']

    if channel and action is None:
        result = "Parameters not set!"
    else:
        result = "Button pressed! Channel: " + str(channel) + ' Action: ' + action

    response = jsonify({"result": result})
    return response

app.run(debug=True)