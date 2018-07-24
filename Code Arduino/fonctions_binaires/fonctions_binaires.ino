long configBinary = 0b0000001111101000000001001011000;
int configStartCode = 0b00001111;

int config_GPS = 0;
int config_BAROMETRE = 0;
int config_THERMOMETRE = 0;
int config_START = 0;
int config_END = 0;

int configCursor = 0;
bool configuring = false;
bool configured = false;
int configArray[16] = {};

void setup(){
  Serial.begin(9600);

  //if(getNthByte(configBinary, 0)==15){
  /*if(true){

     // GPS : 2 bytes

     int configval_GPS = getNthByte(configBinary, configCursor)|(getNthByte(configBinary, ++configCursor)<<8*1); // Concatenate binary values
     Serial.print("GPS: ");
     Serial.println(configval_GPS);
     

     long configval_BAROMETRE= getNthByte(configBinary, ++configCursor)|(getNthByte(configBinary, ++configCursor)<<8*1); // Concatenate binary values
     Serial.print("BAROMETRE: ");
     Serial.println(configval_BAROMETRE);

     long configval_THERMOMETRE = getNthByte(configBinary, ++configCursor)|(getNthByte(configBinary, ++configCursor)<<8*1); // Concatenate binary values
     Serial.print("THERMOMETRE: ");
     Serial.println(configval_THERMOMETRE);
  }*/
}

void loop(){

 if(Serial.available()){
  
  int data = Serial.parseInt(); // A remplacer par Serial.read();

  if(configuring){
    recordConfig(data);
  }

  if(data==configStartCode){
   configuring = true;   
   Serial.println("Configuring");
  }
  
 }
}

bool recordConfig(int data){
  configArray[configCursor] = data;

  configCursor++;
  Serial.println(data, BIN);
    
  if(configCursor>=6){
     configuring = false;
     configure();
  }
}
bool configure(){
  int bufferCursor = 0;
  
  config_GPS = concatenateBinary(configArray[bufferCursor++],configArray[bufferCursor++]);
  Serial.print("GPS: ");
  Serial.println(config_GPS);

  config_BAROMETRE = concatenateBinary(configArray[bufferCursor++],configArray[bufferCursor++]);
  Serial.print("BAROMETRE: ");
  Serial.println(config_BAROMETRE);

  config_THERMOMETRE = concatenateBinary(configArray[bufferCursor++],configArray[bufferCursor++]);
  Serial.print("THERMOMETRE: ");
  Serial.println(config_THERMOMETRE);

  /*config_CLOCK = concatenateBinary(configArray[bufferCursor++],configArray[bufferCursor++]);
  Serial.print("THERMOMETRE: ");
  Serial.println(config_THERMOMETRE); */
  //bufferCursor += 6;

  config_START = concatenateBinary(configArray[bufferCursor++],configArray[bufferCursor++]);
  Serial.print("START: ");
  Serial.println(config_START);

  config_END = concatenateBinary(configArray[bufferCursor++],configArray[bufferCursor++]);
  Serial.print("END: ");
  Serial.println(config_END);
  
}

int getNthByte(long binary, int n){
  // Retourne le N-ième octet d'un nombre entier binaire
  // Return N-th byte of a binary integer

  // 0 --> First byte
  // 1 --> Second byte
  return (int)((binary>>n*8)&0xFF);
}

int concatenateBinary(int b1,int b2){
  return (b2|(b1<<8));
}



char writeIntToSerial(int message){
  // En travaillant en binaire, il faut écrire dans la console octet par octet
  // When working with binary, you must write in the serial byte by byte

  char arr[2] = {};
  
  for(int i = 0; i < sizeof(message); i++){
      arr[i] = (message>>i*8);
      Serial.println((uint8_t)arr[i]);
  }
  
  return Serial.write(arr); // Return number of written bytes
}
