#include <iostream>
#include <string>
#include <thread>
#include <chrono>
#include <cstdlib>
#include <ctime>

// A simple C++ simulator for the Multi-Area AquaSense hardware.
// Generates flow data for Kitchen, Bathroom, and Garden.

void postData(float input_flow, float flow_k, float flow_b, float flow_g, const std::string& message = "OK") {
    // Construct the JSON payload with multi-area and input flow format
    std::string jsonPayload = "{";
    jsonPayload += "\"message\": \"" + message + "\",";
    jsonPayload += "\"main_input_flow\": " + std::to_string(input_flow) + ",";
    jsonPayload += "\"areas\": {";
    jsonPayload += "\"kitchen\": {\"flow_rate\": " + std::to_string(flow_k) + "},";
    jsonPayload += "\"bathroom\": {\"flow_rate\": " + std::to_string(flow_b) + "},";
    jsonPayload += "\"garden\": {\"flow_rate\": " + std::to_string(flow_g) + "}";
    jsonPayload += "}}";
    
    // std::cout << "Sending: " << jsonPayload << std::endl;
                              
    std::string command = "curl -s -X POST http://localhost:5050/api/data "
                          "-H \"Content-Type: application/json\" "
                          "-d '" + jsonPayload + "' > /dev/null";
                          
    int result = system(command.c_str());
    if (result != 0) {
        std::cerr << "Failed to send data to server. Is the Python backend running?" << std::endl;
    }
}

int main() {
    std::cout << "Multi-Area AquaSense Hardware Simulator Started." << std::endl;
    std::cout << "Press Ctrl+C to exit." << std::endl;
    
    std::srand(std::time(nullptr));
    
    // Base nominal flows
    float base_in = 20.0; // Input supply fills tank faster than output
    float base_k = 3.0;
    float base_b = 6.0;
    float base_g = 8.0;
    
    int cycle_count = 0;
    
    while (true) {
        cycle_count++;
        
        // Generate a random fluctuation
        float cur_in = base_in + ((std::rand() % 400 - 200) / 100.0f);
        float cur_k = base_k + ((std::rand() % 200 - 100) / 100.0f);
        float cur_b = base_b + ((std::rand() % 400 - 200) / 100.0f);
        float cur_g = base_g + ((std::rand() % 300 - 150) / 100.0f);
        
        // Simulate municipal water cut for 20 seconds every 60 seconds (approx)
        if (cycle_count % 30 > 20) {
            cur_in = 0.0;
            std::cout << "[INFO] Main supply cut simulated." << std::endl;
        }
        
        std::string message = "OK";
        
        // Randomly simulate an anomaly in a specific area
        int rand_anomaly = std::rand() % 100;
        if (rand_anomaly < 3) {
            cur_b += 10.0; // Sudden high flow in bathroom
            message = "High flow detected in Bathroom! Possible leak.";
            std::cout << "[!] Bathroom anomaly: " << cur_b << " L/min" << std::endl;
        } else if (rand_anomaly >= 3 && rand_anomaly < 5) {
            cur_g += 15.0; // Sudden high flow in garden
            message = "High flow detected in Garden! Pipe burst?";
            std::cout << "[!] Garden anomaly: " << cur_g << " L/min" << std::endl;
        } else {
            std::cout << "Sending data -> IN:" << cur_in << " K:" << cur_k << " B:" << cur_b << " G:" << cur_g << std::endl;
        }
        
        postData(cur_in, cur_k, cur_b, cur_g, message);
        
        // Wait 2 seconds before next reading
        std::this_thread::sleep_for(std::chrono::seconds(2));
    }
    
    return 0;
}
