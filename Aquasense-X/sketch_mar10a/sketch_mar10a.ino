 #include <ESP8266WiFi.h>
#include <BlynkSimpleEsp8266.h>
#include <Servo.h>

// Blynk Credentials
char auth[] = "Your_Blynk_Token";  
char ssid[] = "Your_WiFi_SSID";    
char pass[] = "Your_WiFi_Password"; 

// Sensor Pins (Mapped for ESP8266)
#define INPUT_FLOW_SENSOR D5   // YF-S201 Input Flow Sensor (GPIO14)
#define OUTPUT_FLOW_SENSOR D6  // YF-S201 Output Flow Sensor (GPIO12)
#define TRIG_PIN D1      // HC-SR04 Ultrasonic Sensor Trigger (GPIO5)
#define ECHO_PIN D2      // HC-SR04 Ultrasonic Sensor Echo (GPIO4)
#define SERVO_PIN D3     // Servo Motor for Water Valve (GPIO0)

// Flow Variables
volatile int inputPulseCount = 0;
volatile int outputPulseCount = 0;
float inputFlowRate = 0.0;
float outputFlowRate = 0.0;
int tankLevel = 0;
bool supplyStatus = false;
int servoPosition = 90;  // Default: Half Open

Servo waterValve;
BlynkTimer timer;

// Interrupt Service Routine for Flow Sensors
void ICACHE_RAM_ATTR inputPulseCounter() {
    inputPulseCount++;
}
void ICACHE_RAM_ATTR outputPulseCounter() {
    outputPulseCount++;
}

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

    // Calculate Flow Rate (L/min)
    inputFlowRate = inputPulseCount / 7.5;  // 7.5 pulses = 1L/min
    outputFlowRate = outputPulseCount / 7.5;

    supplyStatus = (inputFlowRate > 1);  // Water supply available if input flow >1 L/min

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

// **Suggestion Algorithm**
void suggestServoAdjustment() {
    int suggestedServoPos = servoPosition;

    // Check if output flow is too high compared to input
    if (outputFlowRate > inputFlowRate * 0.9) {  
        suggestedServoPos = max(servoPosition - 10, 0);  // Reduce flow by closing servo
    } 
    else if (outputFlowRate < inputFlowRate * 0.5) {
        suggestedServoPos = min(servoPosition + 10, 180);  // Increase flow
    }

    // Send Suggestion to Blynk
    Blynk.virtualWrite(V4, suggestedServoPos);
}

// **Apply Suggested Servo Adjustment**
BLYNK_WRITE(V5) {
    int applySuggestion = param.asInt();  
    if (applySuggestion == 1) {
        servoPosition = Blynk.virtualWrite(V4);
        waterValve.write(servoPosition);
        Blynk.virtualWrite(V6, servoPosition);  // Update current position
    }
}

// **Manual Servo Control**
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
