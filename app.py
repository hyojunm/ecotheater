from flask import Flask, render_template
from os import environ

app = Flask(__name__)

@app.route('/')
def home_page():
    return render_template('intro.html')


@app.route('/stage')
def theme_page():
    return render_template('stage.html')

    
if __name__ == '__main__':
    app.run()
