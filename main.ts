let sensorLeft = 0
let sensorRight = 0
let robotMode = "waiting"
let counter = 0
let topLeds = neopixel.create(DigitalPin.P0, 5, NeoPixelMode.RGB)

topLeds.clear()
topLeds.show()

topLeds.setBrightness(50)
topLeds.setPixelColor(0, NeoPixelColors.Red);
topLeds.setPixelColor(1, NeoPixelColors.Black)
topLeds.setPixelColor(2, NeoPixelColors.Black)
topLeds.setPixelColor(3, NeoPixelColors.Black)
topLeds.setPixelColor(4, NeoPixelColors.Green);
//topLeds.show()
//serial.redirectToUSB()

pins.setPull(DigitalPin.P15, PinPullMode.PullUp)
pins.setPull(DigitalPin.P16, PinPullMode.PullUp)

function indicateDirection(direction: Direction) {
    if(direction == Direction.Right) {
        topLeds.setPixelColor(0, NeoPixelColors.Black);
        topLeds.setPixelColor(2, NeoPixelColors.Black);
        topLeds.setPixelColor(4, NeoPixelColors.Red);
    } else {
        topLeds.setPixelColor(0, NeoPixelColors.Green);
        topLeds.setPixelColor(2, NeoPixelColors.Black);
        topLeds.setPixelColor(4, NeoPixelColors.Black);
    }
    topLeds.show()
}

function driveForward(ms = 0) {
    topLeds.setPixelColor(0, NeoPixelColors.Black);
    topLeds.setPixelColor(2, NeoPixelColors.White);
    topLeds.setPixelColor(4, NeoPixelColors.Black);
    topLeds.show()
    
    pins.servoWritePin(AnalogPin.P1, 0)
    pins.servoWritePin(AnalogPin.P2, 180)
    if(ms > 0) {
        pause(ms)
        driveStop()
    }
}

function driveBackward(ms = 0) {
    topLeds.setPixelColor(0, NeoPixelColors.Black);
    topLeds.setPixelColor(2, NeoPixelColors.Orange);
    topLeds.setPixelColor(4, NeoPixelColors.Black);
    topLeds.show()

    pins.servoWritePin(AnalogPin.P1, 0)
    pins.servoWritePin(AnalogPin.P2, 180)
    if(ms > 0) {
        pause(ms)
        driveStop()
    }
}

function driveStop() {
    pins.servoWritePin(AnalogPin.P1, 90)
    pins.servoWritePin(AnalogPin.P2, 90)
}

function driveRight(ms = 100) {
    indicateDirection(Direction.Right)
    pins.servoWritePin(AnalogPin.P1, 90)
    pins.servoWritePin(AnalogPin.P2, 100)
    if(ms > 0) {
        pause(ms)
        driveStop()
    }
}

function driveLeft(ms = 100) {
    indicateDirection(Direction.Left)
    pins.servoWritePin(AnalogPin.P1, 90)
    pins.servoWritePin(AnalogPin.P2, 80)
    if(ms > 0) {
        pause(ms)
        driveStop()
    }
}

function turnUntilSensor(direction: Direction){
    if(direction == Direction.Left) {
        driveLeft()
    } else {
        driveRight()
    }
    sensorRight = pins.digitalReadPin(DigitalPin.P15)
    sensorLeft = pins.digitalReadPin(DigitalPin.P16)
    if(direction == Direction.Left) {
        if(sensorLeft == 0) {
            driveLeft()
        }
    } else {
        if(sensorRight == 0) {
            driveRight()
        }       
    }
    pause(50)
}

function followTheLine(){
    sensorRight = pins.digitalReadPin(DigitalPin.P15)
    sensorLeft = pins.digitalReadPin(DigitalPin.P16)
    serial.writeString("" + counter.toString() + ": R[" + sensorRight + "]  L[" + sensorLeft + "]")
    serial.writeLine("")
    
    if (sensorRight == 1 && sensorLeft == 1) { // move forward
    	driveForward() 
    } else if (sensorRight == 1 && sensorLeft == 0) { // turn left
    	turnUntilSensor(Direction.Left)
    } else if (sensorRight == 0 && sensorLeft == 1) { // turn right
    	turnUntilSensor(Direction.Right)    	
    } else { // stop
        driveStop()
    }
}

input.onButtonPressed(Button.A, function () {
    pause(100)
    //driveRight()
    robotMode = "followTheLine"
})

input.onButtonPressed(Button.B, function () {
    //pause(100)
    //turnUntilSensor(Direction.Left)
})

input.onButtonPressed(Button.AB, function () {
    robotMode = "STOP"
    //turnUntilSensor(Direction.Right)
})

basic.forever(function () {
    if(robotMode == "followTheLine") {
        followTheLine()
    } else {
        //driveStop()
    }
})

