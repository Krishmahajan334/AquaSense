#include <ESP8266WiFi.h>

// Flow Sensor Pin (Connect to D6 = GPIO12)
#define FLOW_SENSOR_PIN 12  

volatile int pulseCount = 0;  // Pulse count from the sensor
float flowRate = 0.0;         // Flow rate in L/min
float totalVolume = 0.0;      // Total water volume in Liters
unsigned long lastTime = 0;

// Interrupt Service Routine (ISR)
void IRAM_ATTR pulseCounter() {
    pulseCount++;
}

void setup() {
    Serial.begin(115200);
    pinMode(FLOW_SENSOR_PIN, INPUT);
    
    // Attach interrupt for flow sensor
    attachInterrupt(digitalPinToInterrupt(FLOW_SENSOR_PIN), pulseCounter, FALLING);
    
    Serial.println("Flow Sensor Test Initialized...");
}

void loop() {
    unsigned long currentTime = millis();

    if (currentTime - lastTime >= 1000) { // Measure every 1 second
        detachInterrupt(digitalPinToInterrupt(FLOW_SENSOR_PIN));  // Stop counting pulses

        flowRate = (pulseCount / 7.5);  // Convert pulses to L/min (YF-S201 calibration)
        totalVolume += (flowRate / 60.0);  // Convert flow rate to total volume in Liters

        Serial.print("Flow Rate: ");
        Serial.print(flowRate);
        Serial.println(" L/min");

        Serial.print("Total Volume: ");
        Serial.print(totalVolume, 3);
        Serial.println(" Liters");

        pulseCount = 0;  // Reset pulse count
        lastTime = currentTime;

        attachInterrupt(digitalPinToInterrupt(FLOW_SENSOR_PIN), pulseCounter, FALLING);  // Resume counting
    }
}
