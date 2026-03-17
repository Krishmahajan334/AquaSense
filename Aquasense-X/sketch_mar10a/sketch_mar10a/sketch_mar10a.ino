#include <ESP8266WiFi.h>
#include <BlynkSimpleEsp8266.h>
#include <Servo.h>

// Blynk Credentials (Replace with your actual credentials)
char auth[] = "Your_Blynk_Token";  
char ssid[] = "Your_WiFi_SSID";    
char pass[] = "Your_WiFi_Password"; 

// Sensor Pins (ESP8266 GPIO Mapping)
#define INPUT_FLOW_SENSOR D5    // YF-S201 Input Flow Sensor
#define OUTPUT_FLOW_SENSOR D6   // YF-S201 Output Flow Sensor
#define TRIG_PIN D7             // HC-SR04 Ultrasonic Sensor Trigger
#define ECHO_PIN D8             // HC-SR04 Ultrasonic Sensor Echo
#define SERVO_PIN D4            // Servo Motor for Water Valve

Servo waterValve;  // Servo Object

// Flow & Water Level Variables
volatile int inputPulseCount = 0;
volatile int outputPulseCount = 0;
float inputFlowRate = 0.0;
float outputFlowRate = 0.0;
int tankLevel = 0;
bool supplyStatus = false;
int servoPosition = 90;  // Default: Half Open
int suggestedServoPos = 90;  // Suggested position for automation

BlynkTimer timer;

// Interrupt Service Routines for Flow Sensors
void IRAM_ATTR inputPulseCounter() { inputPulseCount++; }
void IRAM_ATTR outputPulseCounter() { outputPulseCount++; }

// Read Flow Rate for Input & Output Sensors
void readFlowRates() {
    inputPulseCount = 0;
    outputPulseCount = 0;

    // Attach Interrupts
    attachInterrupt(digitalPinToInterrupt(INPUT_FLOW_SENSOR), inputPulseCounter, FALLING);
    attachInterrupt(digitalPinToInterrupt(OUTPUT_FLOW_SENSOR), outputPulseCounter, FALLING);
    
    delay(1000);  // Measure pulses for 1 second

    // Detach Interrupts
    detachInterrupt(digitalPinToInterrupt(INPUT_FLOW_SENSOR));
    detachInterrupt(digitalPinToInterrupt(OUTPUT_FLOW_SENSOR));

    // Calculate Flow Rate (L/min)  (7.5 pulses = 1L/min)
    inputFlowRate = inputPulseCount / 7.5;
    outputFlowRate = outputPulseCount / 7.5;

    // Determine Supply Status
    supplyStatus = (inputFlowRate > 1);  // If flow is >1 L/min, water is available

    // Send Data to Blynk
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

// **Suggestion Algorithm for Optimizing Water Flow**
void suggestServoAdjustment() {
    suggestedServoPos = servoPosition;  // Default to current position

    if (outputFlowRate > inputFlowRate * 0.9) {  
        suggestedServoPos = max(servoPosition - 10, 0);  // Reduce flow
    } 
    else if (outputFlowRate < inputFlowRate * 0.5) {
        suggestedServoPos = min(servoPosition + 10, 180);  // Increase flow
    }

    Blynk.virtualWrite(V4, suggestedServoPos);
}

// **Apply Suggested Servo Adjustment from Blynk**
BLYNK_WRITE(V5) {
    int applySuggestion = param.asInt();  
    if (applySuggestion == 1) {
        servoPosition = suggestedServoPos;  // Apply suggested position
        waterValve.write(servoPosition);
        Blynk.virtualWrite(V6, servoPosition);
    }
}

// **Manual Servo Control from Blynk**
BLYNK_WRITE(V6) {
    int position = param.asInt();
    waterValve.write(position);
    servoPosition = position;
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
}

void loop() {
    Blynk.run();
    timer.run();
}
