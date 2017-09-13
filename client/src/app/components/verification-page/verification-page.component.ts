import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth/auth.service";

@Component({
  selector: 'app-verification-page',
  templateUrl: './verification-page.component.html',
  styleUrls: ['./verification-page.component.css'],
  providers: [AuthService]
})
export class VerificationPageComponent implements OnInit {

  verificationToken: string = "";

  constructor(private route: ActivatedRoute, private auth: AuthService, private http: HttpClient) {
    this.route.params.subscribe(params => {
      this.verificationToken = params.token;
      this.http.get(`/api/verify?id=${this.verificationToken}`)
      .map(data => JSON.stringify(data))
      .subscribe(data => {
        console.log(data);
        this.auth.saveToLocal(JSON.parse(data));
      },
      err => {
        this.auth.removeWarnings();
        if (err.error instanceof Error) {
          console.log("An error occurred:", err.error.message);
          this.auth.msg.warning('An error occured: ' + err.error.message + '.');
        } else {
          console.log(err);
          console.log('Backend returned code ${err.status}, body was: ${err.error}');
          this.auth.msg.warning('An error occured: ' + err.error + '.');
        }
      })
    })
  }

  ngOnInit() {
  }

}
