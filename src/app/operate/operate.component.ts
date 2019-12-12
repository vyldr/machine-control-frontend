import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-operate',
  templateUrl: './operate.component.html',
  styleUrls: ['./operate.component.css']
})
export class OperateComponent implements OnInit {

  ws;
  message: string;
  input;
  gp;
  gamepadConnected;
  deviceName;
  name: any;


  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    // force route reload whenever params change;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  // Send the input to the server
  send(self) {
    if (self.gamepadConnected)
      self.gamepadInput(self);
    self.ws.send(JSON.stringify(self.input));
    self.input.message = '';
  }

  sendMessage(self) {
    self.input.message = self.message;
    self.message = '';
  }

  // Add a key to the list
  keydown(self, event) {
    if (document.activeElement.id != "message") { // Skip if the user is typing a message
      if (self.input.keys.indexOf(event.key) == -1) {
        self.input.keys.push(event.key);
      }
      if (event.key == 'd') {
        console.log(self.deviceName);
      }
    }

    // Press enter while typing a message
    else if (event.key == "Enter") {
      self.sendMessage(self);
    }
  }

  // Remove the key from the list
  keyup(self, event) {
    var index = self.input.keys.indexOf(event.key);
    if (index > -1) {
      self.input.keys.splice(index, 1);
    }
  }

  // Clear all inputs to clean up
  clearInput(self) {
    self.input.keys = [];
  }

  // Get button and axis inputs from a gamepad
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
    var HOST = environment.websocket;
    this.ws = new WebSocket(HOST);
    this.deviceName = this.activatedRoute.snapshot.params['id'];
    this.name = this.activatedRoute.snapshot.params['name'];

    this.gamepadConnected = false;

    // Data from the server
    // this.ws.onmessage = function (event) {
    //   self.message = JSON.parse(event.data);
    // };

    this.ws.onopen = function () {

      // Tell the server our group name
      self.ws.send(self.deviceName);

      // Start sending data to the server
      setInterval(self.send, 16, self);
    }

    // Which keys are currently pressed?
    this.input = {
      keys: [],
      buttons: [],
      axes: [],
      message: "",
    }

    // Handle changing tab focus
    window.addEventListener('blur', (event) => {
      self.clearInput(self);
    }, false);
    window.addEventListener('focus', (event) => {
      self.clearInput(self);
    }, false);

    // Handle keydowns
    document.addEventListener('keydown', (event) => {
      self.keydown(self, event);
    }, false);

    // Handle keyups
    document.addEventListener('keyup', (event) => {
      self.keyup(self, event);
    }, false);

    // Connect a gamepad
    window.addEventListener("gamepadconnected", function () {
      // @ts-ignore
      self.gp = navigator.getGamepads()[0];
      // @ts-ignore
      console.log("Gamepad " + self.gp.index + " connected: " + self.gp.id + ". " + self.gp.buttons.length + " buttons, " + self.gp.axes.length + " axes.");

      self.gamepadConnected = true; //Interval = setInterval(self.gamepadInput, 16, self);
    });


  }

  ngOnDestroy() {
    // Close the websocket
    this.ws.close();

    // TODO: Remove the event listeners
  }

}
