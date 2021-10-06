from flask import render_template,redirect,url_for,jsonify
from website.models import Objects
from website import app,jsglue

@app.route("/home",methods =['GET'])
@app.route('/raw',methods =['GET'])
def raw():
    '''this route displays the raw data'''

    objects = dict_generator(Objects.query.all())
    return render_template('raw.html',enumerate=enumerate,data=objects,title ='Raw Data')

@app.route('/model',methods =['GET','POST'])
def model():
    '''this route displays the model'''

    return render_template('model.html')

@app.route('/fetch_objects',methods =['GET','POST'])
def fetch_objects():
    '''requests should be sent to this route to get the info of the objects'''

    objects = dict_generator(Objects.query.all())
    return jsonify(objects)