from flask import Flask, request, jsonify
from flask_cors import CORS
# import subprocess 
# import led_detection
import report
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

@app.route('/')
def index():
    return 'Hello, World!'

@app.route('/api/Scan-repo', methods=['POST'])
def Scan_report():
    # print("hi")
    # print(request)
    try:
        # Retrieve image data from the request
        # image_data = request.data
        image = request.files['image']
        image.save('./image.jpg')
        result = report.extract_text_from_image('./image.jpg')
        # print(result.data)
        return result
        # return jsonify({'result': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    



if __name__ == '__main__':
    app.run(debug=True, port=8000)
