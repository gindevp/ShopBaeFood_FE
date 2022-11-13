import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AccountService} from "../../service/account/account.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({
    userName: new FormControl("", [Validators.required, Validators.minLength(3), Validators.pattern("^[a-zA-Z]+$")]),
    password: new FormControl("", [Validators.required]),
    email: new FormControl("", [Validators.required]),
    name: new FormControl("",[Validators.required]),
    phone: new FormControl("", [Validators.required, Validators.minLength(3), Validators.pattern("^[a-zA-Z]+$")]),
    address: new FormControl("",[Validators.required]),
  })
  message:string;
  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
  }
  get userName() {
    return this.registerForm.get("userName")
  }
  get password() {
    return this.registerForm.get("password")
  } get email() {
    return this.registerForm.get("email")
  } get name() {
    return this.registerForm.get("name")
  } get phone() {
    return this.registerForm.get("phone")
  } get address() {
    return this.registerForm.get("address")
  }

  register() {
      this.accountService.register(this.registerForm.value).subscribe((data)=>{
        console.log(data)
        if(data==null){
          this.message="Đăng ký thành công"
        }
      })
  }
}
