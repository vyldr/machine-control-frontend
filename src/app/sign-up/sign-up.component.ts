import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  user: string;
  pass: string;
  pass2: string;
  response: string;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
  }

  submit() {
    var ob = this.http.post(environment.backend + '/signup',
      {
        "user": this.user,
        "pass": this.pass
      }).subscribe((data) => {
        console.log(data);
        // @ts-ignore
        this.response = data.status;
        if (this.response == 'it worked') {
          localStorage.setItem('user', this.user);
          localStorage.setItem('pass', this.pass);
          this.router.navigate(['/']);
        }
      });

  }

}
