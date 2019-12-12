import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  name: string;
  response: string;
  bots: any;

  constructor(private http: HttpClient, private router: Router) { }


  ngOnInit() {
    
    // Kick the user out if they are not signed in
    if (localStorage.getItem('user') == null) {
      this.router.navigate(['/']);
    }

    // Show an updated list
    this.refreshList();
  }

  // Add a new item to the database
  newBot() {
    if (this.name == '' || this.name == undefined) {
      return;
    }
    console.log(this.name);
    var ob = this.http.post(environment.backend + '/addbot',
      {
        "user": localStorage.getItem('user'),
        "pass": localStorage.getItem('pass'),
        "name": this.name,
      }).subscribe((data) => {
        console.log(data);
        // @ts-ignore
        this.response = data.status;
        if (this.response == 'it worked') {
          this.name = '';
          this.refreshList();
        }
      });
  }

  refreshList() {
    var ob = this.http.post(environment.backend + '/getlist',
    {
      "user": localStorage.getItem('user'),
      "pass": localStorage.getItem('pass'),
    }).subscribe((data) => {
      console.log(data);
      // @ts-ignore
      this.response = data.status;
      // @ts-ignore
      this.bots = data.bots;
      console.log(this.bots);
        
    });

  }

}
