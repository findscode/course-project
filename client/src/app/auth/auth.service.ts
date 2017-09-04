import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Profile } from "../profile";
import "rxjs/add/operator/map";

@Injectable()
export class AuthService {
  constructor(private router: Router, private http: HttpClient) {}

  public isAuthenticated() {
    return this.isLoggedIn();
  }

  public saveToken(token) {
    localStorage["mean-token"] = token;
  }

  public getToken() {
    return localStorage["mean-token"];
  }

  public isLoggedIn() {
    let token = this.getToken();
    let payload;

    if (token) {
      payload = token.split(".")[1];
      payload = atob(payload);
      payload = JSON.parse(payload);

      return payload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  public currentUser() {
    if (this.isLoggedIn()) {
      let token = this.getToken();
      let payload = token.split(".")[1];
      payload = atob(payload);
      payload = JSON.parse(payload);
      return {
        email: payload.email,
        name: payload.name
      };
    }
  }

  public register(user: Profile) {
    this.http
      .post("/api/register", user)
      .map(data => JSON.stringify(data))
      .subscribe(
        data => {
          console.log(data);
          this.saveToken(JSON.parse(data).token);
        },
        err => {
          if (err.error instanceof Error) {
            console.log("An error occurred:", err.error.message);
          } else {
            console.log(err);
            console.log(
              `Backend returned code ${err.status}, body was: ${err.error}`
            );
          }
        }
      );
  }

  public login(user: Profile) {
    this.http
      .post("/api/login", user)
      .map(data => JSON.stringify(data))
      .subscribe(
        data => {
          console.log(data);
          this.saveToken(JSON.parse(data).token);
        },
        err => {
          if (err.error instanceof Error) {
            console.log("An error occurred:", err.error.message);
          } else {
            console.log(err);
            console.log(
              `Backend returned code ${err.status}, body was: ${err.error}`
            );
          }
        }
      );
  }

  public logout() {
    localStorage.removeItem("mean-token");
    this.router.navigate(["/"]);
  }
}