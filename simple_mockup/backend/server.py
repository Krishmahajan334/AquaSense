from flask import Flask, jsonify, request, send_from_directory
import os
import random
import socket
import csv
import time
from datetime import datetime
import json
import urllib.request
import urllib.parse
import threading
import ssl

try:
    from google.cloud import firestore
    from google.api_core.exceptions import GoogleAPICallError
    FIRESTORE_AVAILABLE = True
except ImportError:
    FIRESTORE_AVAILABLE = False

# Bypass SSL verification for macOS Python environments
ssl._create_default_https_context = ssl._create_unverified_context

frontend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../frontend')
app = Flask(__name__, static_folder=frontend_dir, static_url_path='')

HISTORY_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'history.csv')
CONFIG_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'config.json')

# Initialize Firestore Client
db = None
if FIRESTORE_AVAILABLE:
    try:
        # Implicitly uses GOOGLE_APPLICATION_CREDENTIALS or Cloud Run Service Account
        db = firestore.Client()
        print("✅ Firestore initialized successfully.")
    except Exception as e:
        print(f"⚠️ Firestore initialization skipped: {e}")
        db = None

def get_config():
    """Helper to get config from Firestore with local fallback."""
    # Try Firestore
    if db:
        try:
            doc = db.collection('config').document('settings').get()
            if doc.exists:
                return doc.to_dict()
        except Exception as e:
            print(f"Firestore config read error: {e}")

    # Fallback to local file
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error reading local config: {e}")
    return {}

def log_to_history(data):
    timestamp = datetime.now()
    log_entry = {
        'Timestamp': timestamp.strftime('%Y-%m-%d %H:%M:%S'),
        'InputFlow': round(data['main_input_flow'], 2),
        'OutputFlow': round(data['total_output_flow'], 2),
        'TankLevel': round(data['tank_level'], 2),
        'KitchenFlow': round(data['areas']['kitchen']['flow_rate'], 2),
        'BathroomFlow': round(data['areas']['bathroom']['flow_rate'], 2),
        'GardenFlow': round(data['areas']['garden']['flow_rate'], 2),
        'WaterSaved': round(data['total_water_saved'], 2)
    }

    # Log to Firestore
    if db:
        try:
            db.collection('history').add(log_entry)
        except Exception as e:
            print(f"Error logging to Firestore: {e}")

    # Fallback/Local Log to CSV
    file_exists = os.path.isfile(HISTORY_FILE)
    with open(HISTORY_FILE, mode='a', newline='') as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(['Timestamp', 'InputFlow', 'OutputFlow', 'TankLevel', 'KitchenFlow', 'BathroomFlow', 'GardenFlow', 'WaterSaved'])
        
        writer.writerow([
            log_entry['Timestamp'],
            log_entry['InputFlow'],
            log_entry['OutputFlow'],
            log_entry['TankLevel'],
            log_entry['KitchenFlow'],
            log_entry['BathroomFlow'],
            log_entry['GardenFlow'],
            log_entry['WaterSaved']
        ])

# In-memory storage with multi-area tracking and auto_mode
system_data = {
    "total_water_usage": 0.0,
    "total_water_saved": 0.0,
    "total_output_flow": 0.0,
    "main_input_flow": 0.0,
    "tank_level": 85.0, # Percentage 0-100
    "supply_available": True,
    "auto_mode": False,
    "suggestions": ["System operating normally. No suggestions."],
    "last_update": None,
    "alerts": ["System initialized. Monitoring all areas."],
    "areas": {
        "kitchen": {"flow_rate": 0.0, "water_usage": 0.0, "aeration": 0, "valve_open": True, "name": "Kitchen"},
        "bathroom": {"flow_rate": 0.0, "water_usage": 0.0, "aeration": 0, "valve_open": True, "name": "Bathroom"},
        "garden": {"flow_rate": 0.0, "water_usage": 0.0, "aeration": 0, "valve_open": True, "name": "Garden/Plantation"}
    }
}

# Initialize system_data names from config
try:
    _cfg = get_config()
    if 'areas' in _cfg:
        for _aid, _name in _cfg['areas'].items():
            if _aid in system_data['areas']:
                system_data['areas'][_aid]['name'] = _name
except:
    pass

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        addr = s.getsockname()[0]
        s.close()
        return addr
    except:
        return "localhost"

def send_telegram_alert(message):
    try:
        if os.path.exists(CONFIG_FILE):
            with open(CONFIG_FILE, 'r') as f:
                config = json.load(f)
            bot_token = config.get('telegram_bot_token')
            chat_id = config.get('telegram_chat_id')
            if bot_token and chat_id:
                url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
                data = urllib.parse.urlencode({'chat_id': chat_id, 'text': f"AquaSense Alert: {message}"}).encode('utf-8')
                req = urllib.request.Request(url, data=data)
                urllib.request.urlopen(req, timeout=5)
    except Exception as e:
        print(f"Failed to send telegram alert: {e}")

def send_telegram_message(chat_id, text):
    try:
        if os.path.exists(CONFIG_FILE):
            with open(CONFIG_FILE, 'r') as f:
                config = json.load(f)
            bot_token = config.get('telegram_bot_token')
            if bot_token:
                url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
                data = urllib.parse.urlencode({'chat_id': chat_id, 'text': text}).encode('utf-8')
                req = urllib.request.Request(url, data=data)
                urllib.request.urlopen(req, timeout=5)
    except Exception as e:
        print(f"Failed to send telegram message: {e}")

def handle_telegram_command(text, chat_id):
    global system_data
    parts = text.lower().split()
    cmd = parts[0]
    
    if cmd == '/report':
        msg = (f"📊 *AquaSense Status Report*\n"
               f"Tank Level: {system_data['tank_level']:.1f}%\n"
               f"Input Flow: {system_data['main_input_flow']:.1f} L/m\n"
               f"Total Output: {system_data['total_output_flow']:.1f} L/m\n"
               f"Total Water Saved: {system_data['total_water_saved']:.1f} L\n"
               f"Auto Mode: {'🟢 ON' if system_data['auto_mode'] else '🔴 OFF'}")
        send_telegram_message(chat_id, msg)
        
    elif cmd == '/area' and len(parts) >= 2:
        subcmd = parts[1]
        if subcmd == 'stats':
            msg = "💧 *Area Statistics*\n"
            for aid, adata in system_data['areas'].items():
                msg += f"- {adata['name']}: {adata['flow_rate']:.1f} L/m ({'Open' if adata['valve_open'] else 'Closed'}, Aer: {adata['aeration']}%)\n"
            send_telegram_message(chat_id, msg)
        elif subcmd == 'control' and len(parts) >= 5:
            # /area control kitchen valve off
            area_id = parts[2]
            setting = parts[3]
            value = parts[4]
            
            if area_id in system_data['areas']:
                if setting == 'valve':
                    is_open = (value == 'on')
                    system_data['areas'][area_id]['valve_open'] = is_open
                    send_telegram_message(chat_id, f"✅ Set {area_id} valve to {'ON' if is_open else 'OFF'}.")
                elif setting == 'aeration':
                    try:
                        aer_val = int(value)
                        system_data['areas'][area_id]['aeration'] = max(0, min(100, aer_val))
                        send_telegram_message(chat_id, f"✅ Set {area_id} aeration to {system_data['areas'][area_id]['aeration']}%.")
                    except ValueError:
                        send_telegram_message(chat_id, "❌ Invalid aeration value.")
            else:
                send_telegram_message(chat_id, "❌ Unknown area.")
    else:
        send_telegram_message(chat_id, "Available commands:\n/report\n/area stats\n/area control <area> valve <on|off>\n/area control <area> aeration <0-100>")

def telegram_polling_loop():
    last_update_id = 0
    while True:
        try:
            config = get_config()
            bot_token = config.get('telegram_bot_token')
            allowed_chat_id = config.get('telegram_chat_id')
            
            # Update area names if they changed in config
            if 'areas' in config:
                for aid, name in config['areas'].items():
                    if aid in system_data['areas']:
                        system_data['areas'][aid]['name'] = name

            if bot_token and allowed_chat_id:
                url = f"https://api.telegram.org/bot{bot_token}/getUpdates?offset={last_update_id + 1}&timeout=5"
                req = urllib.request.Request(url)
                response = urllib.request.urlopen(req, timeout=10)
                data = json.loads(response.read().decode('utf-8'))
                
                if data.get('ok') and data.get('result'):
                    for update in data['result']:
                        last_update_id = update['update_id']
                        message = update.get('message', {})
                        text = message.get('text', '').strip()
                        chat_id = str(message.get('chat', {}).get('id', ''))
                        
                        if chat_id == str(allowed_chat_id) and text.startswith('/'):
                            handle_telegram_command(text, chat_id)
        except Exception as e:
            pass # Ignore timeout/connection errors
        time.sleep(2)

def add_alert(message):
    global system_data
    if not system_data['alerts'] or message != system_data['alerts'][0]:
        system_data['alerts'].insert(0, message)
        system_data['alerts'] = system_data['alerts'][:6]
        # Send critical alerts to telegram
        msg_lower = message.lower()
        if "critical" in msg_lower or "⚠️" in message or "leak" in msg_lower or "burst" in msg_lower or "high flow" in msg_lower:
            send_telegram_alert(message)

def generate_suggestions():
    global system_data
    suggestions = []
    if system_data['tank_level'] < 20:
        suggestions.append("Critical: Tank level below 20%. Progressive aeration active.")
    highest_usage_area = max(system_data['areas'].items(), key=lambda x: x[1]['water_usage'])
    if highest_usage_area[1]['water_usage'] > system_data['total_water_usage'] * 0.5 and system_data['total_water_usage'] > 10:
        suggestions.append(f"Optimize: {highest_usage_area[1]['name']} accounts for >50% usage. Consider higher aeration.")
    if not suggestions:
        suggestions.append("System is optimized. Flow rates are within normal limits.")
    system_data['suggestions'] = suggestions

# Define paths for additional static resources
presentation_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../demo_presentation')
diagrams_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../Diagrams')
outputs_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../Outputs')

@app.route('/')
def serve_index():
    return send_from_directory(frontend_dir, 'index.html')

@app.route('/presentation/')
@app.route('/presentation/index.html')
def serve_presentation():
    return send_from_directory(presentation_dir, 'index.html')

@app.route('/presentation/<path:path>')
def serve_presentation_assets(path):
    return send_from_directory(presentation_dir, path)

@app.route('/Diagrams/<path:path>')
def serve_diagrams(path):
    return send_from_directory(diagrams_dir, path)

@app.route('/Outputs/<path:path>')
def serve_outputs(path):
    return send_from_directory(outputs_dir, path)

@app.route('/debug-paths')
def debug_paths():
    try:
        p_exists = os.path.exists(presentation_dir)
        p_list = os.listdir(presentation_dir) if p_exists else []
        return jsonify({
            "cwd": os.getcwd(),
            "presentation_dir": presentation_dir,
            "exists": p_exists,
            "contents": p_list
        })
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(frontend_dir, path)

@app.after_request
def add_header(response):
    if request.path.startswith('/api/'):
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
    return response


@app.route('/api/data', methods=['GET', 'POST'])
def handle_data():
    global system_data
    if request.method == 'GET':
        generate_suggestions()
        return jsonify(system_data)
        
    data = request.json
    if not data or 'areas' not in data:
        return jsonify({"error": "No JSON data provided"}), 400
        
    total_out = 0.0
    if 'main_input_flow' in data:
        system_data['main_input_flow'] = float(data['main_input_flow'])
        system_data['supply_available'] = system_data['main_input_flow'] > 1.0
        if not system_data['supply_available'] and system_data['tank_level'] < 10:
            add_alert("⚠️ No supply available and tank critical!")
    
    # Advanced Auto Mode: Progressive Aeration Scaling
    auto_base_aeration = 0
    if system_data["auto_mode"]:
        lvl = system_data["tank_level"]
        if lvl < 10: auto_base_aeration = 90
        elif lvl < 25: auto_base_aeration = 70
        elif lvl < 50: auto_base_aeration = 40
        elif lvl < 75: auto_base_aeration = 15

    for area_id, area_data in data['areas'].items():
        if area_id in system_data["areas"]:
            raw_flow = float(area_data.get('flow_rate', 0))
            is_open = system_data["areas"][area_id].get("valve_open", True)
            
            # Use user value or auto-scaled value
            if system_data["auto_mode"]:
                current_user_aeration = system_data["areas"][area_id].get("aeration", 0)
                effective_aeration = max(current_user_aeration, auto_base_aeration)
                system_data["areas"][area_id]["aeration"] = effective_aeration
            else:
                effective_aeration = system_data["areas"][area_id].get("aeration", 0)
            
            if not is_open:
                flow = 0.0
                saved_flow = 0.0
            else:
                flow = raw_flow * (1.0 - (effective_aeration / 100.0))
                saved_flow = raw_flow - flow
            
            system_data["areas"][area_id]["flow_rate"] = flow
            system_data["areas"][area_id]["water_usage"] += flow * 0.1
            system_data["total_water_saved"] += saved_flow * 0.1
            total_out += flow
            
            # Anomaly/Leak detection in Auto Mode (remains same)
            if system_data["auto_mode"]:
                if raw_flow > 12.0 and effective_aeration < 80 and is_open:
                    system_data["areas"][area_id]["aeration"] = 80
                    add_alert(f"⚠️ [Auto Mode] High flow in {system_data['areas'][area_id]['name']}. Aeration 80%.")
                    flow = raw_flow * 0.2
                    # Re-calculate saved for this segment
                    system_data["total_water_saved"] += (raw_flow - flow) * 0.1
                    system_data["areas"][area_id]["flow_rate"] = flow
                
    system_data["total_output_flow"] = total_out
    system_data["total_water_usage"] = sum(a["water_usage"] for a in system_data["areas"].values())
    net_flow = system_data['main_input_flow'] - system_data['total_output_flow']
    system_data['tank_level'] += net_flow * 0.05 
    system_data['tank_level'] = max(0.0, min(100.0, system_data['tank_level']))
    
    if 'message' in data and data['message'] != "OK":
        add_alert(data['message'])
    
    # Log to CSV for analytics
    log_to_history(system_data)
    
    return jsonify({"status": "success"})

@app.route('/api/history')
def get_history():
    history = []
    
    # Try Firestore first
    if db:
        try:
            docs = db.collection('history').order_by('Timestamp', direction=firestore.Query.DESCENDING).limit(500).stream()
            history = [doc.to_dict() for doc in docs]
            history.reverse() # Back to chronological order
            if history:
                return jsonify(history)
        except Exception as e:
            print(f"Firestore read error: {e}")

    # Fallback to CSV
    if not os.path.isfile(HISTORY_FILE):
        return jsonify([])
    
    try:
        with open(HISTORY_FILE, mode='r') as f:
            reader = csv.DictReader(f)
            rows = list(reader)
            history = rows[-500:]
    except Exception as e:
        print(f"Error reading history from CSV: {e}")
        
    return jsonify(history)

@app.route('/api/reports')
def get_reports():
    granularity = request.args.get('granularity', 'hourly')
    rows = []

    try:
        # Try Firestore first
        if db:
            try:
                docs = db.collection('history').order_by('Timestamp').stream()
                rows = [doc.to_dict() for doc in docs]
            except Exception as e:
                print(f"Firestore report error: {e}")

        # Fallback to CSV if Firestore is empty or unavailable
        if not rows and os.path.isfile(HISTORY_FILE):
            try:
                with open(HISTORY_FILE, mode='r') as f:
                    reader = csv.DictReader(f)
                    rows = list(reader)
            except Exception as e:
                print(f"CSV report error: {e}")

        if not rows:
            return jsonify([])

        aggregated = {}
        for row in rows:
            try:
                ts = datetime.strptime(row['Timestamp'], '%Y-%m-%d %H:%M:%S')
            except ValueError:
                continue
                
            if granularity == 'hourly':
                key = ts.strftime('%Y-%m-%d %H:00')
            elif granularity == 'daily':
                key = ts.strftime('%Y-%m-%d')
            elif granularity == 'weekly':
                key = ts.strftime('%G-W%V')
            elif granularity == 'monthly':
                key = ts.strftime('%Y-%m')
            else:
                key = row['Timestamp']

            if key not in aggregated:
                aggregated[key] = {
                    'Timestamp': key,
                    'InputFlow': [], 'OutputFlow': [], 'TankLevel': [],
                    'KitchenFlow': [], 'BathroomFlow': [], 'GardenFlow': [],
                    'WaterSaved': []
                }
            
            for field in ['InputFlow', 'OutputFlow', 'TankLevel', 'KitchenFlow', 'BathroomFlow', 'GardenFlow', 'WaterSaved']:
                if field in row:
                    aggregated[key][field].append(float(row[field]))

        result = []
        for key in sorted(aggregated.keys()):
            item = aggregated[key]
            summary = {'Timestamp': key}
            for field in ['InputFlow', 'OutputFlow', 'TankLevel', 'KitchenFlow', 'BathroomFlow', 'GardenFlow', 'WaterSaved']:
                if item[field]:
                    summary[field] = round(sum(item[field]) / len(item[field]), 2)
                else:
                    summary[field] = 0.0
            result.append(summary)
            
        return jsonify(result)
        
    except Exception as e:
        print(f"Error generating report: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/daily-report')
def get_daily_report():
    date_str = request.args.get('date', datetime.now().strftime('%Y-%m-%d'))
    rows = []

    try:
        # Try Firestore first
        if db:
            try:
                # Query for documents starting with date_str
                docs = db.collection('history') \
                         .where('Timestamp', '>=', date_str) \
                         .where('Timestamp', '<', date_str + '\uf8ff') \
                         .order_by('Timestamp').stream()
                rows = [doc.to_dict() for doc in docs]
            except Exception as e:
                print(f"Firestore daily report error: {e}")

        # Fallback to CSV
        if not rows and os.path.isfile(HISTORY_FILE):
            try:
                with open(HISTORY_FILE, mode='r') as f:
                    reader = csv.DictReader(f)
                    rows = [row for row in reader if row['Timestamp'].startswith(date_str)]
            except Exception as e:
                print(f"CSV daily report error: {e}")

        if not rows:
            return jsonify({"error": "No data for this date"}), 404
                
        # Calculate start availability and end availability
        start_tank_level = float(rows[0]['TankLevel'])
        end_tank_level = float(rows[-1]['TankLevel'])
        
        # Calculate totals
        total_input = sum(float(r['InputFlow']) for r in rows) / max(1, len(rows)) * len(rows) # approx total flow assuming readings are uniform
        total_output = sum(float(r['OutputFlow']) for r in rows) / max(1, len(rows)) * len(rows)
        
        total_kitchen = sum(float(r.get('KitchenFlow', 0)) for r in rows) / max(1, len(rows)) * len(rows)
        total_bathroom = sum(float(r.get('BathroomFlow', 0)) for r in rows) / max(1, len(rows)) * len(rows)
        total_garden = sum(float(r.get('GardenFlow', 0)) for r in rows) / max(1, len(rows)) * len(rows)
        
        return jsonify({
            "date": date_str,
            "start_availability": round(start_tank_level, 2),
            "end_availability": round(end_tank_level, 2),
            "total_input": round(total_input, 2),
            "total_output": round(total_output, 2),
            "areas": {
                "kitchen": round(total_kitchen, 2),
                "bathroom": round(total_bathroom, 2),
                "garden": round(total_garden, 2)
            },
            "hourly_trend": [
                {
                    "hour": r['Timestamp'].split(' ')[1][:2],
                    "tank_level": float(r['TankLevel']),
                    "total_output": float(r['OutputFlow'])
                } for r in rows[::max(1, len(rows)//24)] # Sample ~24 points
            ]
        })
    except Exception as e:
        print(f"Daily report error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/config', methods=['GET', 'POST'])
def handle_config():
    if request.method == 'GET':
        config = get_config()
        return jsonify(config)
    else:
        data = request.json
        
        # Save to Firestore
        if db:
            try:
                db.collection('config').document('settings').set(data)
                print("✅ Config saved to Firestore.")
            except Exception as e:
                print(f"Firestore config save error: {e}")
        
        # Save to local file as backup
        try:
            with open(CONFIG_FILE, 'w') as f:
                json.dump(data, f)
        except Exception as e:
            print(f"Local config save error: {e}")
            
        return jsonify({"status": "success"})

@app.route('/api/admin/test-telegram', methods=['POST'])
def test_telegram():
    data = request.json
    bot_token = data.get('telegram_bot_token')
    chat_id = data.get('telegram_chat_id')
    
    if not bot_token or not chat_id:
        return jsonify({"error": "Missing token or chat id"}), 400
        
    try:
        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        payload = urllib.parse.urlencode({'chat_id': chat_id, 'text': "✅ AquaSense Alert: Test notification successful! Your bot is working correctly."}).encode('utf-8')
        req = urllib.request.Request(url, data=payload)
        urllib.request.urlopen(req, timeout=5)
        return jsonify({"status": "success"})
    except Exception as e:
        print(f"Test Telegram failed: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/admin/reset', methods=['POST'])
def reset_system():
    global system_data
    # Reset history
    if os.path.exists(HISTORY_FILE):
        os.remove(HISTORY_FILE)
    
    # Reset Firestore History if available
    if db:
        try:
            # Batch delete for efficiency
            batch = db.batch()
            docs = db.collection('history').limit(500).stream()
            for doc in docs:
                batch.delete(doc.reference)
            batch.commit()
            print("✅ Firestore history collection cleared.")
        except Exception as e:
            print(f"Firestore reset error: {e}")

    # Reset in-memory data
    system_data["total_water_usage"] = 0.0
    system_data["total_water_saved"] = 0.0
    system_data["total_output_flow"] = 0.0
    system_data["main_input_flow"] = 0.0
    system_data["tank_level"] = 85.0
    for area in system_data["areas"].values():
        area["flow_rate"] = 0.0
        area["water_usage"] = 0.0
        area["aeration"] = 0
        area["valve_open"] = True
    
    add_alert("System state and history reset by admin.")
    return jsonify({"status": "success"})

def keep_alive_ping_loop():
    """Self-pinging loop to keep Render free tier alive."""
    url = "https://aquasense-9g0t.onrender.com/"
    print("🔄 Self-pinging keep-alive thread started.")
    while True:
        try:
            # Simple GET request to the home page
            with urllib.request.urlopen(url, timeout=15) as response:
                if response.status == 200:
                    print(f"✅ Keep-alive: Server pinged successfully at {datetime.now().strftime('%H:%M:%S')}")
        except Exception as e:
            print(f"⚠️ Keep-alive ping failed: {e}")
        
        # Sleep for 10 minutes (Render timeout is 15 mins)
        time.sleep(600)

@app.route('/api/control', methods=['POST'])
def toggle_control():
    global system_data
    data = request.json
    if 'auto_mode' in data:
        system_data['auto_mode'] = bool(data['auto_mode'])
        add_alert(f"Auto Mode {'ENABLED' if system_data['auto_mode'] else 'DISABLED'}")
    if 'area' in data:
        area_id = data['area']
        if area_id in system_data["areas"]:
            if 'aeration' in data:
                system_data["areas"][area_id]["aeration"] = int(data['aeration'])
            if 'valve' in data:
                system_data["areas"][area_id]["valve_open"] = bool(data['valve'])
    return jsonify({"status": "success", "areas": system_data["areas"]})
    
def cloud_simulator_loop():
    """Background thread that simulates hardware data when running in the cloud."""
    print("🚀 Cloud Hardware Simulator Started.")
    while True:
        try:
            # Replicate C++ logic
            base_in = 20.0
            base_k = 3.0
            base_b = 6.0
            base_g = 8.0
            
            # Simple fluctuations
            cur_in = base_in + random.uniform(-2.0, 2.0)
            cur_k = base_k + random.uniform(-1.0, 1.0)
            cur_b = base_b + random.uniform(-2.0, 2.0)
            cur_g = base_g + random.uniform(-1.5, 1.5)
            
            # Simulate Municipal Water Cut (every ~10 mins for 30s)
            now_sec = int(time.time())
            if (now_sec // 600) % 2 == 0 and (now_sec % 600) < 30:
                cur_in = 0.0
            
            # Randomly simulate an anomaly (Leak/High Flow)
            # 3% chance for Bathroom, 2% for Garden
            rand_anomaly = random.randint(0, 100)
            if rand_anomaly < 3:
                cur_b += 10.0
                add_alert("⚠️ High flow detected in Bathroom! Possible leak.")
            elif 3 <= rand_anomaly < 5:
                cur_g += 15.0
                add_alert("⚠️ High flow detected in Garden! Pipe burst?")

            # Update global system_data
            global system_data
            system_data['main_input_flow'] = round(cur_in, 2)
            
            # Areas
            total_out = 0.0
            for area_id, flow in zip(['kitchen', 'bathroom', 'garden'], [cur_k, cur_b, cur_g]):
                if system_data["areas"][area_id]["valve_open"]:
                    raw_flow = flow
                    aeration = system_data["areas"][area_id]["aeration"]
                    
                    # Apply aeration logic (simplified for sim)
                    saved_ratio = aeration / 100.0
                    actual_flow = raw_flow * (1.0 - (saved_ratio * 0.8)) # max 80% reduction
                    
                    system_data["areas"][area_id]["flow_rate"] = round(actual_flow, 2)
                    system_data["areas"][area_id]["water_usage"] += actual_flow * (5/60) # 5s interval -> min
                    system_data["total_water_saved"] += (raw_flow - actual_flow) * (5/60)
                    total_out += actual_flow
                else:
                    system_data["areas"][area_id]["flow_rate"] = 0.0
            
            system_data["total_output_flow"] = round(total_out, 2)
            system_data["total_water_usage"] = sum(a["water_usage"] for a in system_data["areas"].values())
            
            # Tank level
            net_flow = system_data['main_input_flow'] - system_data['total_output_flow']
            system_data['tank_level'] += net_flow * 0.05
            system_data['tank_level'] = max(0.0, min(100.0, system_data['tank_level']))
            
            # Log to History/Firestore
            log_to_history(system_data)
            
        except Exception as e:
            print(f"Cloud Simulator Error: {e}")
            
        time.sleep(5) # Update every 5 seconds

if __name__ == '__main__':
    # Get port from environment variable (default to 5050 for local dev)
    port = int(os.environ.get("PORT", 5050))
    
    # Start telegram polling thread
    # In Flask dev mode (debug=True), the reloader starts a second process.
    # We check WERKZEUG_RUN_MAIN to ensure the thread only starts in the main worker.
    if os.environ.get("WERKZEUG_RUN_MAIN") == "true" or not app.debug:
        # Start telegram polling thread
        t_bot = threading.Thread(target=telegram_polling_loop, daemon=True)
        t_bot.start()
        print("Starting Telegram polling thread...")
        
        # Start cloud simulator thread automatically on Render
        if os.environ.get("RENDER"):
            t_sim = threading.Thread(target=cloud_simulator_loop, daemon=True)
            t_sim.start()
            print("Starting Background Cloud Simulator...")
            
            # Start self-pinging keep-alive thread
            t_keepalive = threading.Thread(target=keep_alive_ping_loop, daemon=True)
            t_keepalive.start()
            print("Starting Internal Keep-Alive Monitor...")
        
    ip = get_local_ip()
    print("\n" + "="*50)
    print(" AQUASENSE DASHBOARD READY")
    print(f" Web Access: http://localhost:{port}")
    print(f" Mobile:     http://{ip}:{port}")
    print("="*50 + "\n")
    
    # Run the app. debug=False is safer for production.
    # Change to debug=True if you need to see errors during development.
    app.run(host='0.0.0.0', port=port, debug=False)
