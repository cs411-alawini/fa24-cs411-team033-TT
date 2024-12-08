from flask import Flask, jsonify, make_response, request
from flask_cors import CORS, cross_origin
import pymysql
# import datetime
# import collections
from google.cloud import storage
import os
from werkzeug.utils import secure_filename

GCS_BUCKET_NAME = 'example_411'  # Replace with your actual GCS bucket name

from dbutils.pooled_db import PooledDB
pool = PooledDB(
    creator=pymysql,
    host='34.132.215.116',
    user='root',
    password='cC12345',
    database='TT',
    charset='utf8mb4',
    cursorclass=pymysql.cursors.DictCursor,
    blocking=True,  # Wait if no connection is available
    maxconnections=10,  # Limit number of concurrent connections
)

def upload_to_gcs(file, filename):
    """Uploads a file to Google Cloud Storage and returns the public URL."""
    credential_file = 'cs411-438601-0532c77fe63b.json'
    client = storage.Client.from_service_account_json(credential_file)
    bucket = client.bucket(GCS_BUCKET_NAME)
    blob = bucket.blob(filename)

    # Upload the file
    blob.upload_from_file(file, content_type=file.content_type)

    # Make the file publicly accessible
    blob.make_public()

    # Return the public URL for the file
    return blob.public_url


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
                     db='TT', charset='utf8mb4',cursorclass=pymysql.cursors.DictCursor)


@app.route('/api/clothes', methods=['POST'])
@cross_origin()
def add_clothes():
    try:
        print(request)
        # UserId = 0
        UserId = request.form.get('UserId', None)
        ClothName = request.form.get('ClothName', None)
        Category = request.form.get('Category', None)
        Subcategory = request.form.get('SubCategory', None)
        Color = request.form.get('Color', None)
        Usages = request.form.get('Usages', None)
        # Image = request.form.get('Image', None)
        TemperatureLevel = request.form.get('TemperatureLevel', None)

        image_file = request.files.get('Image')
        print(f"POST /api/clothes: value({UserId}, {ClothName}, {Category}, {Subcategory}, {Color}, {Usages}, {image_file}, {TemperatureLevel})")
        if image_file:
            filename = secure_filename(image_file.filename)
            image_url = upload_to_gcs(image_file, filename)  # Upload and get the public URL
        else:
            image_url = None
        print(image_url)
        
        with db.cursor() as cursor:
            # Execute SQL query
            sql = """INSERT INTO Clothes (UserId, ClothName, Category, Subcategory, Color, Usages, Image, TemperatureLevel)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""
            cursor.execute(sql, (UserId, ClothName, Category, Subcategory, Color, Usages, image_url, TemperatureLevel))
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
        conn = pool.connection()
        with conn.cursor() as cursor:
            UserId = request.args.get('UserId', None)
            print(f"GET /api/clothes: UserId {UserId}")
            if UserId is not None:
                # Execute SQL query
                sql = """
                    SELECT *
                    FROM Clothes NATURAL JOIN Temperature
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
    finally:
        # Ensure the connection is returned to the pool
        if 'conn' in locals():
            conn.close()



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

    try:
        db.ping(reconnect=True)
    except pymysql.MySQLError:
        return jsonify({"message": "Database connection error"}), 500

    cursor = db.cursor()
    try:
        cursor.execute("SELECT * FROM Users WHERE Email=%s", (email,))
        user = cursor.fetchone()
    except Exception as e:
        return jsonify({"message": "Database query error", "error": str(e)}), 500

    if user is None:
        return jsonify({"message": "Invalid email"}), 401
    
    stored_password = user['Password'].strip()
    if password != stored_password:
        return jsonify({"message": "Wrong password"}), 401

    user_info = {
        'id': user['UserId'],
        'firstName': user['FirstName'],
        'lastName': user['LastName'],
        'phoneNumber': user['PhoneNumber'],
        'email': user['Email']
    }
    return jsonify(user_info), 200


@app.route('/api/register', methods=['POST', 'OPTIONS'])
@cross_origin()
def register():
    if not request.is_json:
        return jsonify({"message": "Missing JSON in request"}), 400

    first_name = request.json.get('FirstName', None)
    last_name = request.json.get('LastName', None)
    phone_number = request.json.get('PhoneNumber', None)
    email = request.json.get('Email', None)
    password = request.json.get('Password', None)

    if not all([first_name, last_name, phone_number, email, password]):
        return jsonify({"message": "Missing parameters"}), 400

    try:
        db.ping(reconnect=True)
    except pymysql.MySQLError as e:
        return jsonify({"message": "Database connection error"}), 500

    cursor = db.cursor()
    try:
        cursor.execute("SELECT * FROM Users WHERE Email=%s", (email,))
        existing_user = cursor.fetchone()
        if existing_user:
            return jsonify({"message": "Email already exists"}), 409

        cursor.execute(
            """
            INSERT INTO Users (FirstName, LastName, PhoneNumber, Email, Password)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (first_name, last_name, phone_number, email, password)
        )
        db.commit()
    except Exception as e:
        return jsonify({"message": "Database query error", "error": str(e)}), 500

    return jsonify({"message": "Registration successful"}), 201

@app.route('/api/wearingHistory', methods=['GET'])
def get_wearing_history():
    try:
        # Get a connection from the pool
        conn = pool.connection()
        with conn.cursor() as cursor:
            UserId = request.args.get('UserId', None)
            print(f"GET /api/wearingHistory: UserId {UserId}")
            if UserId is not None:
                # Execute SQL query
                sql = """
                    SELECT 
                        WH.Date,
                        C1.ClothName AS Cloth1Name, C1.Image AS Cloth1Image, Cloth1 AS Cloth1Id,
                        C2.ClothName AS Cloth2Name, C2.Image AS Cloth2Image, Cloth2 AS Cloth2Id,
                        C3.ClothName AS Cloth3Name, C3.Image AS Cloth3Image, Cloth3 AS Cloth3Id,
                        C4.ClothName AS Cloth4Name, C4.Image AS Cloth4Image, Cloth4 AS Cloth4Id,
                        C5.ClothName AS Cloth5Name, C5.Image AS Cloth5Image, Cloth5 AS Cloth5Id
                    FROM
                        WearingHistory WH
                    LEFT JOIN 
                        Clothes C1 ON C1.ClothId = WH.Cloth1
                    LEFT JOIN 
                        Clothes C2 ON C2.ClothId = WH.Cloth2
                    LEFT JOIN 
                        Clothes C3 ON C3.ClothId = WH.Cloth3
                    LEFT JOIN 
                        Clothes C4 ON C4.ClothId = WH.Cloth4
                    LEFT JOIN 
                        Clothes C5 ON C5.ClothId = WH.Cloth5
                    WHERE 
                        WH.UserId = %s
                    ORDER BY 
                        WH.Date;
                """
                cursor.execute(sql, (UserId,))
                # Get query results
                results = cursor.fetchall()
                return jsonify(results)
            else:
                return jsonify({'error': 'Invalid data'})
    except Exception as e:
        print('Error:', e)
        return jsonify({'error': str(e)})
    finally:
        # Ensure the connection is returned to the pool
        if 'conn' in locals():
            conn.close()

@app.route('/api/wearingHistory', methods=['POST', 'OPTIONS'])
def post_wearing_history():
    try:
        WearingDate = request.form.get('Date', None)
        UserId = request.form.get('UserId', None)
        Cloth1 = request.form.get('Cloth1', None)
        Cloth2 = request.form.get('Cloth2', None)
        Cloth3 = request.form.get('Cloth3', None)
        Cloth4 = request.form.get('Cloth4', None)
        Cloth5 = request.form.get('Cloth5', None)

        print(f"POST /api/wearingHistory: value({WearingDate}, {UserId}, {Cloth1}, {Cloth2}, {Cloth3}, {Cloth4}, {Cloth5})")
        
        with db.cursor() as cursor:
            # Execute SQL query
            sql = """INSERT INTO WearingHistory
                    VALUES (%s, %s, %s, %s, %s, %s, %s, NULL)"""
            cursor.execute(sql, (WearingDate, UserId, Cloth1, Cloth2, Cloth3, Cloth4, Cloth5))
            db.commit()
            
            return jsonify({'message': 'WearingHistory added'})
    except Exception as e:
        db.rollback()
        print('Error:', e)
        return jsonify({'error': str(e)})

@app.route('/api/wearingHistory', methods=['PUT'])
def update_wearing_history():
    try:
        WearingDate = request.form.get('Date', None)
        UserId = request.form.get('UserId', None)
        Cloth1 = request.form.get('Cloth1', None)
        Cloth2 = request.form.get('Cloth2', None)
        Cloth3 = request.form.get('Cloth3', None)
        Cloth4 = request.form.get('Cloth4', None)
        Cloth5 = request.form.get('Cloth5', None)
        print(f"PUT /api/wearingHistory: value({WearingDate}, {UserId}, {Cloth1}, {Cloth2}, {Cloth3}, {Cloth4}, {Cloth5})")
        with db.cursor() as cursor:
            # Execute SQL query
            sql = """UPDATE WearingHistory 
                    SET Cloth1=%s, Cloth2=%s, Cloth3=%s, Cloth4=%s, Cloth5=%s
                    WHERE Date = %s AND UserId = %s"""
            cursor.execute(sql, (Cloth1, Cloth2, Cloth3, Cloth4, Cloth5, WearingDate, UserId))
            db.commit()
            
            return jsonify({'message': f'WearingHistory {UserId} on {WearingDate} update'})
    except Exception as e:
        db.rollback()
        print('Error:', e)
        return jsonify({'error': str(e)})

@app.route('/api/wearingHistory', methods=['DELETE'])
def delete_wearing_history():
    conn = None
    try:
        # Retrieve form data
        WearingDate = request.form.get('Date')
        UserId = request.form.get('UserId')

        # Validate required fields
        if not WearingDate or not UserId:
            return jsonify({'error': 'Missing required fields: Date or UserId'}), 400

        print(f"DELETE /api/wearingHistory: UserId {UserId} on {WearingDate}")
        
        # Get a connection from the pool
        conn = pool.connection()
        with conn.cursor() as cursor:
            # Execute SQL query
            sql = """DELETE FROM WearingHistory
                     WHERE Date = %s AND UserId = %s"""
            cursor.execute(sql, (WearingDate, UserId))
            conn.commit()

        return jsonify({'message': f'WearingHistory {UserId} on {WearingDate} deleted'}), 200
    except Exception as e:
        if conn:
            conn.rollback()
        print('Error:', e)
        return jsonify({'error': str(e)}), 500
    finally:
        # Ensure the connection is returned to the pool
        if conn:
            conn.close()

@app.route('/api/favoriteGroups', methods=['GET'])
def get_all_fav_groups():
    try:
        # Get a connection from the pool
        conn = pool.connection()
        with conn.cursor() as cursor:
            UserId = request.args.get('UserId', None)
            print(f"GET /api/favoriteGroups: UserId {UserId}")
            if UserId is not None:
                # Execute SQL query
                sql = """
                    SELECT *
                    FROM FavoriteGroups
                    WHERE UserId = %s
                """
                cursor.execute(sql, (UserId,))
                # Get query results
                results = cursor.fetchall()
                return jsonify(results)
            else:
                return jsonify({'error': 'Invalid data'})
    except Exception as e:
        print('Error:', e)
        return jsonify({'error': str(e)})
    finally:
        # Ensure the connection is returned to the pool
        if 'conn' in locals():
            conn.close()
    
@app.route('/api/favoriteGroups', methods=['POST'])
@cross_origin()
def add_fav_group():
    try:
        print(request)
        UserId = request.args.get('UserId', None)
        GroupName = request.form.get('GroupName', None)

        print(f"POST /api/favoriteGroups: value({UserId}, {GroupName})")
        
        with db.cursor() as cursor:
            # Execute SQL query
            sql = """INSERT INTO FavoriteGroups(UserId, GroupName)
                    VALUES (%s, %s)"""
            cursor.execute(sql, (UserId, GroupName))
            db.commit()
            
            return jsonify({'message': 'Favorite group added'})
    except Exception as e:
        db.rollback()
        print('Error:', e)
        return jsonify({'error': str(e)})

@app.route('/api/favoriteGroups', methods=['PUT'])
def update_fav_group():
    try:
        FavId = request.args.get('FavoriteId', None)
        GroupName = request.args.get('GroupName', None)
        print(f"PUT /api/clothes: value({FavId}, {GroupName})")
        with db.cursor() as cursor:
            # Execute SQL query
            sql = """UPDATE FavoriteGroups 
                    SET GroupName=%s
                    WHERE FavoriteId=%s"""
            cursor.execute(sql, (GroupName, FavId))
            db.commit()
            
            return jsonify({'message': f'Favorite group {FavId} update'})
    except Exception as e:
        db.rollback()
        print('Error:', e)
        return jsonify({'error': str(e)})
    
@app.route('/api/favoriteGroups', methods=['DELETE'])
def delete_fav_group():
    try:
        FavId = request.form.get('FavoriteId')

        print(f"DELETE /api/favoriteGroups: FavoriteId {FavId}")
        with db.cursor() as cursor:
            # Execute SQL query
            sql = """DELETE FROM FavoriteGroups
                    WHERE Favoriteid=%s"""
            cursor.execute(sql, (FavId))
            db.commit()
            return jsonify({'message': f'Favorite Group {FavId} deleted'})
    except Exception as e:
        db.rollback()
        print('Error:', e)
        return jsonify({'error': str(e)})

@app.route('/api/include', methods=['GET'])
def get_include():
    try:
        conn = pool.connection()
        with conn.cursor() as cursor:
            FavId = request.args.get('FavoriteId', None)
            print(f"GET /api/include: FavoriteId {FavId}")
            if FavId is not None:
                # Execute SQL query
                sql = """
                    SELECT *
                    FROM Include
                    WHERE FavoriteId = %s
                    """
                cursor.execute(sql, (FavId))
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
    finally:
        if 'conn' in locals():
            conn.close()

@app.route('/api/include', methods=['POST'])
@cross_origin()
def add_include():
    try:
        print(request)
        FavId = request.form.get('FavoriteId', None)
        ClothId = request.form.get('ClothId', None)

        print(f"POST /api/favoriteGroups: value({FavId}, {ClothId})")
        
        with db.cursor() as cursor:
            # Execute SQL query
            sql = """INSERT INTO Include
                    VALUES (%s, %s)"""
            cursor.execute(sql, (FavId, ClothId))
            db.commit()
            
            return jsonify({'message': 'Include relationship added'})
    except Exception as e:
        db.rollback()
        print('Error:', e)
        return jsonify({'error': str(e)})
    
@app.route('/api/include', methods=['PUT'])
def update_include():
    try:
        FavId = request.args.get('FavoriteId', None)
        ClothId = request.args.get('ClothId', None)
        print(f"PUT /api/include: value({FavId}, {ClothId})")
        with db.cursor() as cursor:
            # Execute SQL query
            sql = """UPDATE Include
                    SET FavoriteId=%s
                    WHERE FavoriteId=%s AND ClothId=%s"""
            cursor.execute(sql, (FavId, FavId, ClothId))
            db.commit()
            
            return jsonify({'message': f'Include relationship FavoriteId {FavId} with ClothId {ClothId} update'})
    except Exception as e:
        db.rollback()
        print('Error:', e)
        return jsonify({'error': str(e)})

@app.route('/api/include', methods=['DELETE'])
def delete_include():
    try:
        FavId = request.form.get('FavoriteId')
        ClothId = request.form.get('ClothId')

        print(f"DELETE /api/include: FavoriteId {FavId} and ClothId {ClothId}")
        with db.cursor() as cursor:
            # Execute SQL query
            sql = """DELETE FROM Include
                    WHERE Favoriteid=%s AND ClothId=%s"""
            cursor.execute(sql, (FavId, ClothId))
            db.commit()
            return jsonify({'message': f'Include relationship FavoriteId {FavId} with ClothId {ClothId} deleted'})
    except Exception as e:
        db.rollback()
        print('Error:', e)
        return jsonify({'error': str(e)})

@app.route('/api/tags', methods=['GET'])
def get_tags():
    try:
        # Get a connection from the pool
        conn = pool.connection()
        with conn.cursor() as cursor:
            ClothId = request.args.get('ClothId', None)
            print(f"GET /api/tags: ClothId {ClothId}")
            if ClothId is not None:
                # Execute SQL query
                sql = """
                    SELECT *
                    FROM Include NATURAL JOIN FavoriteGroups
                    WHERE ClothId = %s
                """
                cursor.execute(sql, (ClothId,))
                # Get query results
                results = cursor.fetchall()
                return jsonify(results)
            else:
                return jsonify({'error': 'Invalid data'})
    except Exception as e:
        print('Error:', e)
        return jsonify({'error': str(e)})
    finally:
        # Ensure the connection is returned to the pool
        if 'conn' in locals():
            conn.close()

@app.route('/api/recommendationInputs', methods=['GET'])
def get_colors():
    try:
        # Get a connection from the pool
        conn = pool.connection()
        with conn.cursor() as cursor:
            UserId = request.args.get('UserId', None)
            print(f"GET /api/recommendationInputs: UserId {UserId}")

            if UserId is not None:
                # Execute SQL query with parameterized input
                sql = """
                    SELECT DISTINCT Color AS Color, 'None' AS Usages, 'None' AS Category
                    FROM Clothes
                    WHERE UserId = %s

                    UNION

                    SELECT DISTINCT 'None' AS Color, Usages AS Usages, 'None' AS Category
                    FROM Clothes
                    WHERE UserId = %s

                    UNION

                    SELECT DISTINCT 'None' AS Color, 'None' AS Usages, Category AS Category
                    FROM Clothes
                    WHERE UserId = %s
                """
                cursor.execute(sql, (UserId, UserId, UserId))
                results = cursor.fetchall()

                # Convert results to JSON and return response
                response = jsonify(results)
                response.headers['Content-Type'] = 'application/json'
                return response
            else:
                return jsonify({'error': 'Invalid data'})

    except Exception as e:
        print('Error:', e)
        return jsonify({'error': str(e)})

    finally:
        # Ensure the connection is returned to the pool
        if 'conn' in locals():
            conn.close()

@app.route('/api/recommendationResult', methods=['GET'])
def get_ootd():
    try:
        # 接收參數
        UserId = request.args.get('UserId', None)
        Category = request.args.get('Category', None)
        Color = request.args.get('Color', None)
        Usages = request.args.get('Usages', None)
        CurrentTemperature = request.args.get('CurrentTemperature', None)

        if UserId is None:
            return jsonify({'error': 'Invalid UserId'})
        conn = pool.connection()

        with conn.cursor() as cursor:
            # 檢查並創建存儲過程
            create_procedure_sql = """
                CREATE PROCEDURE GetRecommendedClothes(
                    IN p_UserId INT,
                    IN p_Category VARCHAR(255),
                    IN p_Color VARCHAR(255),
                    IN p_Usages VARCHAR(255),
                    IN p_CurrentTemperature INT
                )
                BEGIN
                    SELECT c.*,
                            CASE
                                WHEN c.Color = p_Color THEN 1 ELSE 0
                            END +
                            CASE
                                WHEN c.Usages = p_Usages THEN 1 ELSE 0
                            END +
                            CASE
                                WHEN p_CurrentTemperature > t.TemperatureMin AND p_CurrentTemperature < t.TemperatureMax THEN 1 ELSE 0
                            END +
                            CASE
                                WHEN NOT EXISTS (
                                    SELECT 1
                                    FROM WearingHistory wh
                                    WHERE (wh.Cloth1 = c.ClothId OR 
                                            wh.Cloth2 = c.ClothId OR 
                                            wh.Cloth3 = c.ClothId OR 
                                            wh.Cloth4 = c.ClothId OR 
                                            wh.Cloth5 = c.ClothId)
                                    AND wh.Date >= DATE_SUB(CURRENT_DATE, INTERVAL 14 DAY)
                                ) THEN 1 ELSE 0
                            END AS Score
                    FROM Clothes c
                    NATURAL JOIN Temperature t
                    WHERE c.UserId = p_UserId
                        AND c.Category = p_Category
                    ORDER BY Score DESC;
                END;
            """
            try:
                cursor.execute("DROP PROCEDURE IF EXISTS GetRecommendedClothes;")
                cursor.execute(create_procedure_sql)
            except Exception as e:
                print("Error creating procedure:", str(e))

            # 呼叫存儲過程
            print("Calling procedure with:", UserId, Category, Color, Usages, CurrentTemperature)
            call_procedure_sql = "CALL GetRecommendedClothes(%s, %s, %s, %s, %s)"
            cursor.execute(call_procedure_sql, (UserId, Category, Color, Usages, int(CurrentTemperature)))
            results = cursor.fetchall()

            # 返回結果
            if not results:
                return jsonify({'error': 'No data found for the given criteria'})

            response_data = jsonify(results).get_data().decode('utf8')
            response = make_response(response_data)
            response.headers['Content-Type'] = 'application/json'
            return response
    except Exception as e:
        import traceback
        error_message = traceback.format_exc()
        print('Error Traceback:', error_message)
        return jsonify({'error': str(e), 'trace': error_message})
    finally:
        # Ensure the connection is returned to the pool
        if 'conn' in locals():
            conn.close()

@app.route('/api/colorfrequency', methods=['GET'])
def get_color_frequency():
    try:
        # Get a connection from the pool
        conn = pool.connection()
        with conn.cursor() as cursor:
            # Get parameters from the request
            UserId = request.args.get('UserId', None, type=int)
            IntervalDays = request.args.get('IntervalDays', None, type=int)

            # Validate parameters
            if UserId is None or IntervalDays is None:
                return jsonify({'error': 'Missing required parameters: UserId or IntervalDays'}), 400

            # Check and create the stored procedure if it doesn't exist
            create_procedure_sql = """
            CREATE PROCEDURE GetColorFrequency(
                IN input_UserId INT,
                IN input_IntervalDays INT
            )
            BEGIN
                IF input_IntervalDays <= 0 THEN
                    SELECT 'Error: The interval days must be greater than 0' AS ErrorMessage;
                ELSE
                    SELECT c.Color, 
                        COUNT(*) AS ColorFrequency
                    FROM WearingHistory wh
                    JOIN Clothes c 
                        ON wh.Cloth1 = c.ClothId OR wh.Cloth2 = c.ClothId 
                        OR wh.Cloth3 = c.ClothId OR wh.Cloth4 = c.ClothId 
                        OR wh.Cloth5 = c.ClothId
                    WHERE wh.UserId = input_UserId
                    AND wh.Date BETWEEN DATE_SUB(CURRENT_DATE, INTERVAL input_IntervalDays DAY) 
                                    AND CURRENT_DATE
                    AND c.Color IS NOT NULL
                    GROUP BY c.Color
                    ORDER BY ColorFrequency DESC;
                END IF;
            END;
            """
            try:
                cursor.execute("DROP PROCEDURE IF EXISTS GetColorFrequency;")
                cursor.execute(create_procedure_sql)
            except Exception as e:
                print("Error creating procedure:", str(e))

            # Call the stored procedure
            print("Calling procedure with:", UserId, IntervalDays)
            call_procedure_sql = "CALL GetColorFrequency(%s, %s)"
            cursor.execute(call_procedure_sql, (UserId, IntervalDays))
            results = cursor.fetchall()

            # Process results
            if not results:
                return jsonify({'error': 'No data found for the given criteria'}), 404

            response = jsonify(results)
            response.headers['Content-Type'] = 'application/json'
            return response

    except Exception as e:
        import traceback
        error_message = traceback.format_exc()
        print('Error Traceback:', error_message)
        return jsonify({'error': str(e), 'trace': error_message}), 500

    finally:
        # Ensure the connection is returned to the pool
        if 'conn' in locals():
            conn.close()

@app.route('/api/posts', methods=['GET'])
def get_all_posts():
    try:
        # Get a connection from the pool
        Today = request.args.get('Date', None)
        conn = pool.connection()
        if Today:
            with conn.cursor() as cursor:
                print(f"GET /api/posts")
                # Execute SQL query
                sql = """
                    SELECT 
                        Posts.PostId,
                        Posts.Description,
                        Users.FirstName,
                        Users.LastName,
                        WH.Date,
                        Users.Votes,
                        C1.ClothName AS Cloth1Name, C1.Image AS Cloth1Image, Cloth1 AS Cloth1Id,
                        C2.ClothName AS Cloth2Name, C2.Image AS Cloth2Image, Cloth2 AS Cloth2Id,
                        C3.ClothName AS Cloth3Name, C3.Image AS Cloth3Image, Cloth3 AS Cloth3Id,
                        C4.ClothName AS Cloth4Name, C4.Image AS Cloth4Image, Cloth4 AS Cloth4Id,
                        C5.ClothName AS Cloth5Name, C5.Image AS Cloth5Image, Cloth5 AS Cloth5Id
                    FROM
                        WearingHistory WH
                    NATURAL JOIN Posts
                    LEFT JOIN 
                        Clothes C1 ON C1.ClothId = WH.Cloth1
                    LEFT JOIN 
                        Clothes C2 ON C2.ClothId = WH.Cloth2
                    LEFT JOIN 
                        Clothes C3 ON C3.ClothId = WH.Cloth3
                    LEFT JOIN 
                        Clothes C4 ON C4.ClothId = WH.Cloth4
                    LEFT JOIN 
                        Clothes C5 ON C5.ClothId = WH.Cloth5
                    LEFT JOIN Users ON Users.UserId = WH.UserId
                    WHERE 
                        WH.Date = %s
                """
                cursor.execute(sql, (Today))
                # Get query results
                results = cursor.fetchall()
                return jsonify(results)
    except Exception as e:
        print('Error:', e)
        return jsonify({'error': str(e)})
    finally:
        # Ensure the connection is returned to the pool
        if 'conn' in locals():
            conn.close()

@app.route('/api/votes', methods=['GET'])
def get_votes():
    try:
        Today = request.args.get('Date', None)
        UserId = request.args.get('UserId', None)
        if Today and UserId:
            conn = pool.connection()
            print(f"GET /api/votes")
            with conn.cursor() as cursor:
                    cursor.execute("SELECT VoteNum FROM Votes WHERE Date=%s AND UserId=%s", (Today, UserId))
                    votes = cursor.fetchone()
                    if votes is None:
                        cursor.execute("INSERT INTO Votes VALUES(%s, %s, 5)", (Today, UserId))
                        cursor.execute("SELECT VoteNum FROM Votes WHERE Date=%s AND UserId=%s", (Today, UserId))
                        votes = cursor.fetchone()
                        conn.commit()
                    return jsonify(votes)
    except Exception as e:
        db.rollback()
        print('Error:', e)
        return jsonify({'error': str(e)})
    finally:
        # Ensure the connection is returned to the pool
        if 'conn' in locals():
            conn.close()

@app.route('/api/post', methods=['POST'])
def post_today_wearing_history():
    try:
        Today = request.form.get('Date', None)
        UserId = request.form.get('UserId', None)
        Description = request.form.get('Description', None)

        print(f"PUT /api/post: UserId ({UserId})")
        if Today and UserId:
            with db.cursor() as cursor:
                # Execute SQL query
                cursor.execute("INSERT INTO Posts VALUES(0, %s)", (Description))
                postId = str(cursor.lastrowid)
                sql = """UPDATE WearingHistory 
                        SET PostId = %s
                        WHERE Date = %s AND UserId = %s"""
                cursor.execute(sql, (postId, Today, UserId))
                db.commit()
                
                return jsonify({'message': f'outfit Posted: PostId: {postId}'})
    except Exception as e:
        db.rollback()
        print('Error:', e)
        return jsonify({'error': str(e)})
    
@app.route('/api/vote', methods=['POST', 'OPTIONS'])
def vote():
    Today = request.form.get('Date', None)
    UserId = request.form.get('UserId', None)
    PostId = request.form.get('PostId', None)

    print(f"POST /api/vote: User {UserId} vote for Post {PostId})")
    if Today and UserId and PostId:
        try:
            conn = pool.connection()
            with conn.cursor() as cursor:
                cursor.execute("SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE")
                cursor.execute("START TRANSACTION")
                # check votes you have
                cursor.execute('SELECT VoteNum FROM Votes WHERE Date= %s AND UserId=%s', (Today, UserId))
                votes = cursor.fetchone()
                votes = votes['VoteNum']
                if votes == 0:
                    return jsonify({"message": "Out of votes"})
                
                sql_remove = """UPDATE Votes
                                SET VoteNum =  VoteNum - 1
                                WHERE Date=%s AND UserId=%s"""
                cursor.execute(sql_remove, (Today, UserId))

                print(PostId)

                # Add one vote to the 'Users' table
                sql_add = """
                    UPDATE Users AS u
                    SET Votes = (
                        SELECT temp.Votes + 1
                        FROM (
                            SELECT u2.Votes 
                            FROM Users u2
                            WHERE u2.UserId = (
                                SELECT w.UserId
                                FROM WearingHistory w
                                WHERE w.PostId = %s
                            )
                        ) AS temp
                    )
                    WHERE u.UserId = (
                        SELECT w.UserId
                        FROM WearingHistory w
                        WHERE w.PostId = %s
                    );
                """
                
                cursor.execute(sql_add, (PostId, PostId))
                # add vote history
                sql = """INSERT INTO VoteHistory
                        VALUES (%s, %s, %s)"""
                cursor.execute(sql, (Today, UserId, PostId))
                conn.commit()
                
                return jsonify({'message': 'voted'})
        except Exception as e:
            if conn:
                conn.rollback()
            print('Error:', e)
            return jsonify({'error': str(e)})
        finally:
            if 'conn' in locals():
                conn.close()

@app.route('/api/voted', methods=['GET'])
def voted():
    try:
        Today = request.args.get('Date', None)
        UserId = request.args.get('UserId', None)
        if Today and UserId:
            conn = pool.connection()
            print(f"GET /api/voted")
            with conn.cursor() as cursor:
                    cursor.execute("SELECT PostId FROM VoteHistory WHERE Date=%s AND UserId=%s", (Today, UserId))
                    posts = cursor.fetchall()
                    return jsonify(posts)
    except Exception as e:
        print('Error:', e)
        return jsonify({'error': str(e)})
    finally:
        # Ensure the connection is returned to the pool
        if 'conn' in locals():
            conn.close()

@app.route('/api/unvote', methods=['POST', 'OPTIONS'])
def unvote():
    Today = request.form.get('Date', None)
    UserId = request.form.get('UserId', None)
    PostId = request.form.get('PostId', None)

    print(f"POST /api/vote: User {UserId} vote for Post {PostId})")
    if Today and UserId and PostId: 
        try:
            conn = pool.connection()
            with conn.cursor() as cursor:
                # cursor.execute("SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE")
                cursor.execute("SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE")
                cursor.execute("START TRANSACTION")
                # add one vote to User
                sql_remove = """UPDATE Votes
                                SET VoteNum = (
                                    SELECT temp.VoteNum + 1
                                    FROM (
                                        SELECT VoteNum
                                        FROM Votes
                                        WHERE Date=%s AND UserId=%s
                                    ) AS temp
                                )
                                WHERE Date=%s AND UserId=%s"""
                cursor.execute(sql_remove, (Today, UserId, Today, UserId))
                sql_remove_vote = """
                    UPDATE Users AS u
                    SET Votes = (
                        SELECT temp.Votes - 1
                        FROM (
                            SELECT u2.Votes 
                            FROM Users u2
                            WHERE u2.UserId = (
                                SELECT w.UserId
                                FROM WearingHistory w
                                WHERE w.PostId = %s
                            )
                        ) AS temp
                    )
                    WHERE u.UserId = (
                        SELECT w.UserId
                        FROM WearingHistory w
                        WHERE w.PostId = %s
                    );
                """
                cursor.execute(sql_remove_vote, (PostId, PostId))

                # Remove vote history
                sql_delete_vote_history = """
                    DELETE FROM VoteHistory
                    WHERE Date = %s AND UserId = %s AND PostId = %s; 
                """
                cursor.execute(sql_delete_vote_history, (Today, UserId, PostId))
                conn.commit()
                
                return jsonify({'message': 'unvoted'})
        except Exception as e:
            if conn:
                conn.rollback()
            print('Error:', e)
            return jsonify({'error': str(e)})
        finally:
            # Ensure the connection is returned to the pool
            if 'conn' in locals():
                conn.close()

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5050,debug=True)
