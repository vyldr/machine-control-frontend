import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  user: any;
  pass: any;
  response: string;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {

    // Skip if signed in
    if (localStorage.getItem('user') != null && localStorage.getItem('pass') != null) {
      this.router.navigate(['/manage']);
    }
  }

  submit() {
    var ob = this.http.post(environment.backend + '/signin',
      {
        "user": this.user,
        "pass": this.pass
      }).subscribe((data) => {
        console.log(data);
        // @ts-ignore
        this.response = data.status;
        if (this.response == 'it worked') {
          localStorage.setItem('user', this.user); // TODO: Use real cookies
          localStorage.setItem('pass', this.pass);
          this.router.navigate(['/manage']);
        }
      });

  }

}
