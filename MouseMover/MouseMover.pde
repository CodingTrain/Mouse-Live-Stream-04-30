import http.requests.*;
import java.awt.*;
Robot robot;

void setup() {
  try { 
    robot = new Robot();
  } 
  catch(Exception e) {
    println(e);
  }
}

void draw() {
  GetRequest get = new GetRequest("http://localhost:3000/mouse"); 
  get.send();
  String moveTo = get.getContent();
  float[] values = float(moveTo.split(","));
  robot.mouseMove(int(values[0]*1920), int(values[1]*1080));
}
