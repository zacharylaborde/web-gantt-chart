import dash
import dash_bootstrap_components as dbc

from sda_gantt import SDAGantt

app = dash.Dash(
    __name__,
    external_stylesheets=[dbc.themes.BOOTSTRAP],
    external_scripts=[{'src': 'https://cdn.socket.io/4.5.4/socket.io.min.js'}]
)

app.layout = SDAGantt(app)

if __name__ == "__main__":
    app.run_server(debug=False)
