from flask import Flask, jsonify, make_response, request
from flask_cors import CORS, cross_origin
import pymysql
# import datetime
# import collections

app = Flask(__name__)
cors = CORS(app, resources={
    r"/api/*": {  # Apply CORS to specific routes (e.g., any route starting with /api/)
        "origins": ["http://localhost:3000", "*"],  # Replace with your frontend origin
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})
app.config['CORS_HEADERS'] = 'Content-Type'

app.config['JSON_AS_ASCII'] = False
app.config['JSON_SORT_KEYS'] = False
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True
app.config['JSONIFY_MIMETYPE'] = 'application/json;charset=utf-8'

# Database connection information
db = pymysql.connect(host='34.132.215.116',
                     user='root',
                     passwd='cC12345',
                     db='TT', charset='utf8mb4', cursorclass=pymysql.cursors.DictCursor)


@app.route('/api/clothes', methods=['POST'])
@cross_origin()
def add_clothes():
    try:
        ClothId = 0
        UserId = request.args.get('UserId', None)
        ClothName = request.args.get('ClothName', None)
        Category = request.args.get('Category', None)
        Subcategory = request.args.get('Subcategory', None)
        Color = request.args.get('Color', None)
        Usages = request.args.get('Usages', None)
        Image = request.args.get('Image', None)
        TemperatureLevel = request.args.get('TemperatureLevel', None)
        print(f"POST /api/clothes: value({ClothId}, {UserId}, {ClothName}, {Category}, {Subcategory}, {Color}, {Usages}, {Image}, {TemperatureLevel})")
        with db.cursor() as cursor:
            # Execute SQL query
            sql = """INSERT INTO Clothes 
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"""
            cursor.execute(sql, (ClothId, UserId, ClothName, Category, Subcategory, Color, Usages, Image, TemperatureLevel))
            db.commit()
            
            return jsonify({'message': 'Clothes added'})
    except Exception as e:
        db.rollback()
        print('Error:', e)
        return jsonify({'error': str(e)})
    
@app.route('/api/clothes', methods=['DELETE'])
def delete_clothes():
    try:
        ClothId = request.args.get('ClothId')
        print(f"DELETE /api/clothes: ClothId {ClothId}")
        with db.cursor() as cursor:
            # Execute SQL query
            sql = """DELETE FROM Clothes 
                    WHERE ClothId = %s"""
            cursor.execute(sql, (ClothId))
            db.commit()
            
            return jsonify({'message': f'Clothes {ClothId} deleted'})
    except Exception as e:
        db.rollback()
        print('Error:', e)
        return jsonify({'error': str(e)})
    
@app.route('/api/clothes', methods=['PUT'])
def update_clothes():
    try:
        ClothId = request.args.get('ClothId', None)
        UserId = request.args.get('UserId', None)
        ClothName = request.args.get('ClothName', None)
        Category = request.args.get('Category', None)
        Subcategory = request.args.get('Subcategory', None)
        Color = request.args.get('Color', None)
        Usages = request.args.get('Usages', None)
        Image = request.args.get('Image', None)
        TemperatureLevel = request.args.get('TemperatureLevel', None)
        print(f"PUT /api/clothes: value({ClothId}, {UserId}, {ClothName}, {Category}, {Subcategory}, {Color}, {Usages}, {Image}, {TemperatureLevel})")
        with db.cursor() as cursor:
            # Execute SQL query
            sql = """UPDATE Clothes 
                    SET ClothName=%s, Category=%s, Subcategory=%s, Color=%s, Usages=%s, Image=%s, TemperatureLevel=%s
                    WHERE ClothId=%s"""
            cursor.execute(sql, (ClothName, Category, Subcategory, Color, Usages, Image, TemperatureLevel, ClothId))
            db.commit()
            
            return jsonify({'message': f'Clothes {ClothId} update'})
    except Exception as e:
        db.rollback()
        print('Error:', e)
        return jsonify({'error': str(e)})

@app.route('/api/clothes', methods=['GET'])
def get_all_clothes():
    try:
        with db.cursor() as cursor:
            UserId = request.args.get('UserId', None)
            print(f"GET /api/clothes: UserId {UserId}")
            if UserId is not None:
                # Execute SQL query
                sql = """
                    SELECT *
                    FROM Clothes
                    WHERE UserId = %s
                    """
                cursor.execute(sql, (UserId))
                # Get query results
                results = cursor.fetchall()
                # Convert results to JSON format string and encode with UTF-8
                response_data = jsonify(results).get_data().decode('utf8')
                # Create a new response object and pass the encoded string as data
                response = make_response(response_data)
                response.headers['Content-Type'] = 'application/json'
                return response
            else:
                return jsonify({'error': 'Invalid data'})
    except Exception as e:
        print('Error:', e)
        return jsonify({'error': str(e)})
    
@app.route('/api/login', methods=['POST', 'OPTIONS'])
@cross_origin()
def login():
    if not request.is_json:
        return jsonify({"message": "Missing JSON in request"}), 400
    email = request.json.get('Email', None)
    password = request.json.get('Password', None)
    if not email:
        return jsonify({"message": "Missing email parameter"}), 400
    if not password:
        return jsonify({"message": "Missing password parameter"}), 400
    cursor = db.cursor()
    cursor.execute("SELECT * FROM Users WHERE Email=%s", (email))
    user = cursor.fetchone()
    if user is None:
        return jsonify({"message": "Invalid email or password"}), 401
    stored_password = user[5].strip()
    if password != stored_password:
        return jsonify({"message": "Invalid email or password"}), 401
    user_info = {
        'id': user[0],
        'firstName': user[1],
        'lastName': user[2],
        'phoneNumber': user[3],
        'email': user[4]
    }
    return jsonify(user_info), 200

@app.route('/api/signup', methods=['POST', 'OPTIONS'])
@cross_origin()
def signup():
    if not request.is_json:
        return jsonify({"message": "Missing JSON in request"}), 400

    # Extracting user information from the JSON request
    userId = 0
    email = request.json.get('Email', None)
    password = request.json.get('Password', None)
    first_name = request.json.get('FirstName', '')
    last_name = request.json.get('LastName', '')
    phone_number = request.json.get('PhoneNumber', '')

    # Checking if required fields are present
    if not email:
        return jsonify({"message": "Missing email parameter"}), 400
    if not password:
        return jsonify({"message": "Missing password parameter"}), 400
    if not first_name:
        return jsonify({"message": "Missing first name"}), 400
    if not last_name:
        return jsonify({"message": "Missing last name"}), 400

    cursor = db.cursor()

    # Check if the user already exists
    cursor.execute("SELECT * FROM Users WHERE Email=%s", (email,))
    user = cursor.fetchone()
    if user:
        return jsonify({"message": "Email already registered"}), 409

    # Insert the new user into the database
    try:
        cursor.execute("""
            INSERT INTO Users (UserId, FirstName, LastName, PhoneNumber, Email, Password)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (userId, first_name, last_name, phone_number, email, password))
        db.commit()
    except Exception as e:
        db.rollback()
        return jsonify({"message": "Error saving user"}), 500

    return jsonify({"message": "User registered successfully"}), 201


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5050,debug=True)