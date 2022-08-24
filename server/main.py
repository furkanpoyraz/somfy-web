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

    return jsonify({"data": data})

@app.route('/channels', methods = ['DELETE'])
def deleteChannel():
    id = request.json['id']

    file = open("channels.json", "r")
    data = json.load(file)
    file.close()

    for i, channel in enumerate(data):
        if channel['id'] == id:
            data.pop(i)

    file = open("channels.json", "w+")
    file.write(json.dumps(data))
    file.close()

    response = jsonify({"message": "Channel removed successfully!"})

    return response

@app.route('/channels', methods = ['PUT'])
def addChannel():
    id = request.json['id']
    name = request.json['name']

    file = open("channels.json", "r")
    data = json.load(file)
    file.close()

    data.append({ "id": id, "name": name })
    def sortByID(k):
        return k['id']
    data.sort(key=sortByID)

    file = open("channels.json", "w+")
    file.write(json.dumps(data))
    file.close()

    response = jsonify({"message": "Channel added successfully!"})

    return response

@app.route('/shutters', methods = ['PATCH'])
def setShutters():
    channel = request.json['channel']
    action = request.json['action']

    if channel or action is None:
        result = "Parameters not set!"
    else:
        result = "Button pressed! Channel: " + str(channel) + ' Action: ' + action

    response = jsonify({"message": result})
    return response

app.run(debug=True)