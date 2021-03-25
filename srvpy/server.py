
from flask import Flask
from flask import request
from flask import Response
from flask import send_from_directory
from flask import abort

from sap import xssec
import os
import json
from cfenv import AppEnv
from hdbcli import dbapi

app = Flask(__name__)


# Read cf environmental variables
env = AppEnv()
port = int(os.getenv("PORT", 9099))

# Get hostname
if env.name is None:
    with open('default-env.json') as json_file:
        env = json.load(json_file)
        uaa_service = env['VCAP_SERVICES']['xsuaa'][0]['credentials'] 
        hana = env['VCAP_SERVICES']['hana'][0]['credentials'] 
      
else:
    uaa_service = env.get_service(name='bookshop-backend-uaa').credentials
    hana = env.get_service(label='hana').credentials



# mkdir -p local
# pip install -t local -r requirements.txt -f /tmp



# routes

@app.route('/hello')
def hello():
    #check if authorization information is provided
    if 'authorization' not in request.headers:
        abort(403)
    
    #check if user is authorized
    access_token = request.headers.get('authorization')[7:]
    security_context = xssec.create_security_context(access_token, uaa_service)
    isAuthorized = security_context.check_scope('openid')
    if not isAuthorized:
        abort(403)
    conn = dbapi.connect(address=hana['host'],
                         port=int(hana['port']),
                         user=hana['user'],
                         password=hana['password'],
                         CURRENTSCHEMA=hana['schema'])

    if conn.isconnected():
        print('Connection to databse successful')
    else:
        print('Unable to connect to database')

    sql = 'select SESSION_USER from DUMMY'
    cursor = conn.cursor()
    cursor.execute(sql)
    ro = cursor.fetchone()
    print(ro)
    cursor.close()
    conn.close()

    return "Current User is: " + str(ro)



if __name__ == '__main__':
    # Run the app, listening on all IPs with our chosen port number
    # Use this for production
    # app.run(host='0.0.0.0', port=port)
    # Use this for debugging
    app.run(debug=True, host='0.0.0.0', port=port)