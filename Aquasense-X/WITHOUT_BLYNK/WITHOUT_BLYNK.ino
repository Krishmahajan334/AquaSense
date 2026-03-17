#include <ESP8266WiFi.h>
#include <Servo.h>

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

    Serial.print("Input Flow Rate: ");
    Serial.print(inputFlowRate);
    Serial.println(" L/min");

    Serial.print("Output Flow Rate: ");
    Serial.print(outputFlowRate);
    Serial.println(" L/min");

    Serial.print("Water Supply: ");
    Serial.println(supplyStatus ? "Available" : "Not Available");
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

    Serial.print("Tank Level: ");
    Serial.print(tankLevel);
    Serial.println("%");
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

    Serial.print("Suggested Servo Position: ");
    Serial.println(suggestedServoPos);
}

// **Manual Servo Control**
void manualServoControl(int position) {
    waterValve.write(position);
    servoPosition = position;

    Serial.print("Manual Servo Position Set To: ");
    Serial.println(servoPosition);
}

void setup() {
    Serial.begin(115200);

    pinMode(INPUT_FLOW_SENSOR, INPUT);
    pinMode(OUTPUT_FLOW_SENSOR, INPUT);
    pinMode(TRIG_PIN, OUTPUT);
    pinMode(ECHO_PIN, INPUT);
    
    waterValve.attach(SERVO_PIN);
    waterValve.write(servoPosition);  // Default Half Open

    Serial.println("System Initialized!");
}

void loop() {
    readFlowRates();
    readWaterLevel();
    suggestServoAdjustment();

    delay(5000);  // Wait 5 seconds before next reading
}
