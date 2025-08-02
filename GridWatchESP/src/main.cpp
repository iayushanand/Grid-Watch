#include <Arduino.h>
#include <HttpClient.h>
#include <WiFi.h>


const char WIFI_SSID[] = "your-wifi-ssid";
const char WIFI_PASSWORD[] = "your-wifi-password";

String url = "your-backend-url";

void makeRequest();
void connectWifi();

void setup() {
  connectWifi();
}

void loop() {
  makeRequest();
  delay(60000);
}


void connectWifi() {
  Serial.begin(9600);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.println("Starting Connection Request");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Attemping Connection Request...");
  }
  Serial.print("Connected to WiFi Network with IP: ");
  Serial.println(WiFi.localIP());
  Serial.end();
}


void makeRequest() {
  HTTPClient http;
  
  Serial.begin(9600);
  http.begin(url);
  http.addHeader("X-ApiKey", "your-api-key");
  int httpCode = http.GET();

  if (httpCode > 0) {
    if (httpCode == HTTP_CODE_OK) {
      Serial.println("Ping successful");
    }
  } else {
    Serial.println("[HTTP] GET failed");
  }

  http.end();
  Serial.end();
}