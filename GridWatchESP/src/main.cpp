#include <Arduino.h>
#include <HttpClient.h>
#include <WiFi.h>


#define LED_PIN 2
const char WIFI_SSID[] = "your-wifi-ssid";
const char WIFI_PASSWORD[] = "your-wifi-password";


String url = "your-backend-url";


void makeRequest();
void connectWifi();


void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(115200);
  connectWifi();
}


void loop() {
  makeRequest();
  delay(10000);
}


void connectWifi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.println("Starting Connection Request");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    digitalWrite(LED_PIN, HIGH);
    Serial.println("Attemping Connection Request...");
    digitalWrite(LED_PIN, LOW);
  }
  Serial.print("Connected to WiFi Network with IP: ");
  Serial.println(WiFi.localIP());
}


void makeRequest() {
  HTTPClient http;
  http.begin(url);
  http.addHeader("X-ApiKey", "your-api-key");
  digitalWrite(LED_PIN, HIGH);
  int httpCode = http.GET();
  digitalWrite(LED_PIN, LOW);

  if (httpCode > 0) {
    if (httpCode == HTTP_CODE_OK) {
      Serial.println("Ping successful");
    }
  } else {
    Serial.println("[HTTP] GET failed");
  }

  http.end();
}