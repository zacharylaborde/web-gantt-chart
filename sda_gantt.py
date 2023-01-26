import flask
from flask_socketio import SocketIO
from dash import html, ClientsideFunction, Input, Output
import json


class SDAGantt(html.Div):
    """The SDA Gantt Chart"""

    def __init__(self, app):
        self.app = app
        self.socketio = SocketIO(app.server)
        super().__init__(id='sda-gantt-display')
        self.app.clientside_callback(
            clientside_function=ClientsideFunction(
                namespace='gantt',
                function_name='init_gantt',
            ),
            inputs=Input('sda-gantt-display', "id"),
            output=Output('sda-gantt-display', "id"),
        )

        @self.socketio.on('update')
        def update_event(req):
            # The following is a simulated server request.
            res = None
            with open("events.json", "r") as jsonFile:
                json_file = json.load(jsonFile)

            for event in json_file["events"]:
                if str(event["id"]) == str(req["event"]):
                    event[req["property"]] = req["to"]
                    res = event

            with open("events.json", "w") as jsonFile:
                json.dump(json_file, jsonFile)
            self.socketio.emit('update', res)

        @self.socketio.on('create')
        def create_event(req):
            # The following is a simulated server request.
            count = 0
            with open("events.json", "r") as jsonFile:
                json_file = json.load(jsonFile)

            # Generate a new id.
            if not 'id' in req.keys():
                while any(event['id'] == count for event in json_file["events"]):
                    count += 1
                req['id'] = count

            json_file["events"].append(req)

            with open("events.json", "w") as jsonFile:
                json.dump(json_file, jsonFile)
            self.socketio.emit('update', req)

        @self.socketio.on('delete')
        def delete_event(req):
            # The following is a simulated server request.
            with open("events.json", "r") as jsonFile:
                json_file = json.load(jsonFile)

            for event in json_file["events"]:
                if str(event["id"]) == str(req["event"]):
                    json_file["events"].remove(event)

            with open("events.json", "w") as jsonFile:
                json.dump(json_file, jsonFile)
            self.socketio.emit('delete', req)

        @app.server.route("/sda-event-categories/<id>")
        def event_categories(id):
            # The following is a simulated server request.
            if str(id).upper() == "TEST UNITS":
                res = {"TEST UNITS": [
                    "16T", "APTU", "TUNNEL A", "TUNNEL B", "TUNNEL C", "TUNNEL D", "SL2", "SL3",
                    "J5", "J6", "C1", "C2", "J4", "J1", "J2", "H1", "H2", "H3"
                ]}
                return flask.jsonify(res)
            if str(id).upper() == "MAINTENANCE":
                res = {"MAINTENANCE": [
                    "GENERAL",
                    "RAW WATER SYSTEM",
                    "HIGH PRESSURE AIR SYSTEM (PRODUCTION SIDE)",
                    "HIGH PRESSURE AIR SYSTEM (CONSUMPTION SIDE)",
                    "ELECTRICAL SYSTEM",
                    "STEAM SYSTEM",
                    "PROCESS AIR SYSTEM",
                    "EXHAUST SYSTEM"
                ]}
                return flask.jsonify(res)
            if str(id).upper() == "UTILITY":
                res = {"UTILITY": [
                    "J5 BOTTLE CHARGE",
                    "APTU BOTTLE CHARGE"
                ]}
                return flask.jsonify(res)
            return flask.jsonify("error")

        @app.server.route("/sda-gantt/get-event-types")
        def event_sections():
            # The following is a simulated server request.
            sda_gantt_sections = {"sections": ["TEST UNITS", "UTILITY", "MAINTENANCE"]}
            return flask.jsonify(sda_gantt_sections)

        @app.server.route('/sda-gantt/get-events', methods=["UPDATE"])
        def get_events():
            # The following is a simulated server request.
            req = json.loads(flask.request.data)
            start_day = req["startDay"]
            num_days  = req["numDays"]
            with open("events.json", "r") as jsonFile:
                res = json.load(jsonFile)
            return flask.jsonify(res)

        @app.server.route('/sda-gantt/get-conflicts-and-warnings', methods=["UPDATE"])
        def get_conflicts():
            # The following is a simulated server request.
            req = json.loads(flask.request.data)
            start_day = req["startDay"]
            num_days = req["numDays"]
            schedule_version = req["scheduleString"]
            with open("conflicts.json", "r") as jsonFile:
                res = json.load(jsonFile)
            return flask.jsonify(res)

        @app.server.route('/sda-gantt/get-all-projects')
        def get_all_projects():
            return flask.jsonify({
                "projects": [
                    {
                        "id": 1,
                        "name": "ALPHA"
                    },
                    {
                        "id": 2,
                        "name": "BRAVO"
                    },
                    {
                        "id": 3,
                        "name": "CHARLIE"
                    },
                    {
                        "id": 4,
                        "name": "DELTA"
                    },
                    {
                        "id": 5,
                        "name": "ECHO"
                    },
                    {
                        "id": 6,
                        "name": "FOXTROT"
                    },
                    {
                        "id": 7,
                        "name": "GOLF"
                    },
                    {
                        "id": 8,
                        "name": "HOTEL"
                    },
                    {
                        "id": 9,
                        "name": "INDIA"
                    },
                ]
            })

        @app.server.route('/sda-gantt/get-activity-code-colors')
        def get_activity_code_colors():
            return flask.jsonify({
                "TEST UNITS": {
                    "CONFLICT": "error",
                    "TEST": "deep",
                    "CHECKOUT": "violet",
                    "INSTRUMENTATION CHECKOUT": "violet",
                    "REMOVAL": "maroon",
                    "NONE": "smoke",
                    # "1": "good",
                    # "2": "warn",
                    # "3": "mint",
                },
                "UTILITY": {
                    "SUPPORT": "support",
                    "NONE": "smoke",
                },
                "MAINTENANCE": {
                    "MAINTENANCE": "tan",
                    "NONE": "smoke",
                },
                "NONE": "smoke",
            })
