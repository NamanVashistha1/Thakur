from PIL import Image
import pytesseract
# from data import extract_disability_info
from flask import Flask, jsonify

# from data import extract_parameters
# from thyroid_data import convert_report_to_json
# Path to the Tesseract executable (modify this based on your system configuration)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def extract_text_from_image(image_path):
    try:
        # Open the image using PIL (Python Imaging Library)
        image = Image.open(image_path)

        # Use Tesseract to do OCR on the image
        extracted_text = pytesseract.image_to_string(image)

        # # Print the extracted text
        # print("Extracted Text from Image:")
        # print(extracted_text)
      
        # print("hi")
        # print(extracted_text)
        return jsonify(extracted_text)
        # return result
    
    except Exception as e:
        print("Error occurred during OCR:", e)
        return None
