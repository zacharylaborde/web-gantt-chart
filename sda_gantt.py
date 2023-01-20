import dash_bootstrap_components as dbc
import flask
from flask_socketio import SocketIO
from dash import html, ClientsideFunction, Input, Output
import json


class SDAGantt(html.Div):
    """The SDA Gantt Chart"""

    def __init__(self, app):
        self.app = app
        self.socketio = SocketIO(app.server)
        with open("events.json", "r") as jsonFile:
            data = json.load(jsonFile)
        super().__init__([
            html.Div(json.dumps(data), id="gantt-init", style={'display': 'none'}),
            html.Div(children=[], id='sda-gantt-display')
        ],
        )
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
            self.render()
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
            self.render()
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
            self.render()
            self.socketio.emit('delete', req)

        @app.server.route("/sda-event-categories/<id>")
        def event_categories(id):
            # The following is a simulated server request.
            if str(id).upper() == "TEST UNITS":
                res = {"TEST UNITS": [
                    "16T", "APTU", "TUNNEL A", "TUNNEL B", "TUNNEL C", "TUNNEL D"
                ]}
                return flask.jsonify(res)
            if str(id).upper() == "MAINTENANCE":
                res = {"MAINTENANCE": [
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

        @app.server.route("/sda-gantt/get-sections")
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


    def render(self):
        """Renders the Gantt Chart."""
        with open("events.json", "r") as jsonFile:
            data = json.load(jsonFile)
        super().__init__([
            html.Div(json.dumps(data), id="gantt-init", style={'display': 'none'}),
            dbc.Input(
                id='UpdateGanttEvent',
                type='text',
                style={'display': 'none'}
            )],
            id='sda-gantt-display',
        )
