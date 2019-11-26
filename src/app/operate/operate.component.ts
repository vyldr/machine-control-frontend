import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-operate',
  templateUrl: './operate.component.html',
  styleUrls: ['./operate.component.css']
})
export class OperateComponent implements OnInit {

  ws;
  message;
  input;
  gp;
  gamepadConnected;


  constructor() {
  }

  // Send the input to the server
  send(self) {
    if (self.gamepadConnected)
      self.gamepadInput(self);
    self.ws.send(JSON.stringify(self.input));
    // display.innerHTML = JSON.stringify(input, null, 4);
    // console.log(self.input);
    self.input.keys = []; // clear the keys
  }

  keydown(self, event) {
    self.input.keys.push(event.key);
    switch (event.key) {
      // case "ArrowUp":
      //   self.input.up = true;
      //   break;
      // case "ArrowDown":
      //   self.input.down = true;
      //   break;
      // case "ArrowLeft":
      //   self.input.left = true;
      //   break;
      // case "ArrowRight":
      //   self.input.right = true;
      //   break;
      // case " ":
      //   self.input.space = true;
      //   break;
      case "d": // Debug
        console.log(self.input)
        break;
    }
  }

  keyup(self, event) {

  }

  gamepadInput(self) {
    // @ts-ignore
    var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
    if (!gamepads)
      return;

    self.input.axes = gamepads[0].axes;

    var buttons = [];
    for (var i = 0; i < gamepads[0].buttons.length; i++)
      buttons[i] = gamepads[0].buttons[i].pressed;
    self.input.buttons = buttons;

  };


  ngOnInit() {
    var self = this;
    // Set up the WebSocket
    // var HOST = location.origin.replace(/^http/, 'ws');
    var HOST = 'ws://localhost:5000';
    this.ws = new WebSocket(HOST);
    this.gamepadConnected = false;

    // Data from the server
    // this.ws.onmessage = function (event) {
    //   self.message = JSON.parse(event.data);
    // };

    // var display = document.getElementById("display");

    this.ws.onopen = function () {

      // Tell the server our group name
      self.ws.send('foo');

      // Start sending data to the server
      setInterval(self.send, 16, self);
    }

    // Unfocus the text box because we are using the keyboard for input
    // document.getElementById("group").blur();

    // Which keys are currently pressed?
    this.input = {
      keys: [],
      buttons: [],
      axes: []
    }


    // Handle keydowns
    document.addEventListener('keydown', (event) => {
      self.keydown(self, event);
    }, false);

    // Handle keyups
    document.addEventListener('keyup', (event) => {
    }, false);

    window.addEventListener("gamepadconnected", function () {
      // @ts-ignore
      self.gp = navigator.getGamepads()[0];
      // @ts-ignore
      console.log("Gamepad " + gp.index + " connected: " + gp.id + ". " + gp.buttons.length + " buttons, " + gp.axes.length + " axes.");

      self.gamepadConnected = true; //Interval = setInterval(self.gamepadInput, 16, self);
    });


  }

}
