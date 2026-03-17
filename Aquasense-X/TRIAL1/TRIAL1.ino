#include <ESP8266WiFi.h>
#include <BlynkSimpleEsp8266.h>
#include <Servo.h>

// Blynk Authentication Token (Replace with your Blynk App Token)
char auth[] = "Your_Blynk_Token";  
char ssid[] = "Your_WiFi_SSID";    
char pass[] = "Your_WiFi_Password"; 

// Sensor Pins
#define INPUT_FLOW_SENSOR 12   // YF-S201 Input Flow Sensor (D6)
#define OUTPUT_FLOW_SENSOR 13  // YF-S201 Output Flow Sensor (D7)
#define TRIG_PIN 5      // HC-SR04 Ultrasonic Sensor Trigger (D1)
#define ECHO_PIN 4      // HC-SR04 Ultrasonic Sensor Echo (D2)
#define SERVO_PIN 14    // Servo Motor for Water Valve (D5)

Servo waterValve;  // Servo Object

// Flow Variables
volatile int inputPulseCount = 0;
volatile int outputPulseCount = 0;
float inputFlowRate = 0.0;
float outputFlowRate = 0.0;
int tankLevel = 0;
bool supplyStatus = false;
int servoPosition = 90;  // Default: Half Open
bool autoMode = false;   // Auto Mode Status

BlynkTimer timer;

// Interrupt Service Routines for Flow Sensors
void IRAM_ATTR inputPulseCounter() {
    inputPulseCount++;
}
void IRAM_ATTR outputPulseCounter() {
    outputPulseCount++;
}

// Read Flow Rate for Input & Output Sensors
void readFlowRates() {
    inputPulseCount = 0;
    outputPulseCount = 0;

    attachInterrupt(digitalPinToInterrupt(INPUT_FLOW_SENSOR), inputPulseCounter, FALLING);
    attachInterrupt(digitalPinToInterrupt(OUTPUT_FLOW_SENSOR), outputPulseCounter, FALLING);
    
    delay(1000);  // Measure pulses for 1 second

    detachInterrupt(digitalPinToInterrupt(INPUT_FLOW_SENSOR));
    detachInterrupt(digitalPinToInterrupt(OUTPUT_FLOW_SENSOR));

    inputFlowRate = inputPulseCount / 7.5;  // 7.5 pulses = 1L/min
    outputFlowRate = outputPulseCount / 7.5;

    supplyStatus = (inputFlowRate > 1);  // Water supply available if input flow >1 L/min

    Blynk.virtualWrite(V0, inputFlowRate);
    Blynk.virtualWrite(V1, outputFlowRate);
    Blynk.virtualWrite(V2, supplyStatus ? "Available" : "Not Available");
}

// Read Water Level using HC-SR04
void readWaterLevel() {
    digitalWrite(TRIG_PIN, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);

    long duration = pulseIn(ECHO_PIN, HIGH);
    int distance = duration * 0.034 / 2;  // Convert to cm

    tankLevel = map(distance, 0, 30, 100, 0);  // Assuming tank height is 30cm

    Blynk.virtualWrite(V3, tankLevel);
}

// **Suggestion Algorithm**
void suggestServoAdjustment() {
    int suggestedServoPos = servoPosition;

    if (outputFlowRate > inputFlowRate * 0.9) {  
        suggestedServoPos = max(servoPosition - 10, 0);  // Reduce flow by closing servo
    } 
    else if (outputFlowRate < inputFlowRate * 0.5) {
        suggestedServoPos = min(servoPosition + 10, 180);  // Increase flow
    }

    Blynk.virtualWrite(V4, suggestedServoPos);

    // Auto Mode: Apply the suggestion automatically
    if (autoMode) {
        servoPosition = suggestedServoPos;
        waterValve.write(servoPosition);
        Blynk.virtualWrite(V6, servoPosition);  // Update current position
    }
}

// **Apply Suggested Servo Adjustment (Manual Mode)**
BLYNK_WRITE(V5) {
    int applySuggestion = param.asInt();  
    if (applySuggestion == 1) {
        Blynk.syncVirtual(V4);  // Ensure latest value is fetched
        servoPosition = param.asInt();  
        waterValve.write(servoPosition);
        Blynk.virtualWrite(V6, servoPosition);  // Update current position
    }
}

// **Manual Servo Control**
BLYNK_WRITE(V6) {
    servoPosition = param.asInt();
    waterValve.write(servoPosition);
}

// **Auto Mode Toggle**
BLYNK_WRITE(V8) {
    autoMode = param.asInt();  // 1 = Enabled, 0 = Disabled
    Blynk.virtualWrite(V9, autoMode ? "Enabled" : "Disabled");  
}

// **Wi-Fi Auto-Reconnect**
void checkWiFi() {
    if (WiFi.status() != WL_CONNECTED) {
        WiFi.disconnect();
        WiFi.begin(ssid, pass);
        Serial.println("Reconnecting to Wi-Fi...");
        Blynk.virtualWrite(V7, "Disconnected");
    } else {
        Blynk.virtualWrite(V7, "Connected");
    }
}

void setup() {
    Serial.begin(115200);
    WiFi.begin(ssid, pass);

    pinMode(INPUT_FLOW_SENSOR, INPUT);
    pinMode(OUTPUT_FLOW_SENSOR, INPUT);
    pinMode(TRIG_PIN, OUTPUT);
    pinMode(ECHO_PIN, INPUT);
    
    waterValve.attach(SERVO_PIN);
    waterValve.write(servoPosition);  // Default Half Open

    Blynk.begin(auth, ssid, pass);

    // Timers for Sensor Readings
    timer.setInterval(2000L, readFlowRates);  
    timer.setInterval(5000L, readWaterLevel);
    timer.setInterval(3000L, suggestServoAdjustment);  
    timer.setInterval(10000L, checkWiFi);  // Check Wi-Fi every 10 seconds
}

void loop() {
    Blynk.run();
    timer.run();
}
