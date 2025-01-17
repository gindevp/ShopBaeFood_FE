import {Component, OnInit} from '@angular/core';
import {AccountService} from "../../service/account/account.service";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {Account} from "../../model/account";
import {finalize} from "rxjs";
import {Router} from "@angular/router";
import {AccountToken} from "../../model/accountToken";
import {UserService} from "../../service/user/user.service";
import {AppUser} from "../../model/appUser";
import {MerchantService} from "../../service/merchant/merchant.service";
import {Merchant} from "../../model/merchant";
import swal from "sweetalert";

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {

  constructor(private accountService: AccountService,
              private storage: AngularFireStorage,
              private userService: UserService,
              private router: Router) {
    this.getAccountToId();
    this.getAccountToken();
  }

  ngOnInit(): void {


  }

  ngDoCheck(): void {
    if (this.getAccountToken() == null) {
      this.message = "chua dang nhap";
    }
  }

  acc: any;
  account: Account;
  imgSrc: any;
  selectedImage: any;
  user: AppUser;
  data: any;

  getAccountToId() {
    if (this.getAccountToken() == null) {
      this.router.navigate(["/home"])
    } else {
      let account_id = this.getAccountToken().id;
      // this.user = JSON.parse(localStorage.getItem("data")!).user;
      this.accountService.getAccountToId(account_id).subscribe(data => {
        this.account = data;
        console.log("day la acc")
        console.log(data)
        console.log("day la acc")
        this.imgSrc = this.account.user.avatar;
      });
    }
  }

  message: any;
  disabeled: boolean = true;
  adisabeled: boolean = false;

  showFormUpdate() {
    this.disabeled = false;
  }

  show: string = "none";

  showimg() {
    this.show = "";
  }

  showPreview(event: any) {
    this.adisabeled = !this.adisabeled
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0])
      this.selectedImage = event.target.files[0];
      //upload file lên firebase
      if (this.selectedImage != null) {
        const filePath = `${this.selectedImage.name.split('.').splice(0, -1).join('.')}_${new Date().getTime()}`
        const fileRef = this.storage.ref(filePath);
        this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe(url => {
              this.account.user.avatar = url;
              this.adisabeled = !this.adisabeled;
            })
          })
        ).subscribe();
      }
    } else {
      this.imgSrc = this.user.avatar;
      this.selectedImage = null;
    }
  }

  logout() {
    window.localStorage.clear();
    this.router.navigate(['/home'])
  }

  updateUserInfo() {
    this.account.enabled = true;
    this.accountService.updateAccountUser(this.account.id, this.account).subscribe(() => {
      console.log("update thanh cong");
      console.log(this.account);
      console.log(this.account.user.id)
      console.log(this.user.id);
      this.getAccountToId();
      this.disabeled = true;
    });

    this.userService.updateUser(this.account.user.id, this.account.user).subscribe(() => {
      console.log("update thanh cong lan 2");
      this.disabeled = true;
    })
  }

  getAccountToken() {
    this.data = localStorage.getItem("data")!;
    return JSON.parse(this.data);
  }

  setLocalStorage() {
    swal({
      title: "Bạn có chắc muốn đổi mật khẩu",
      text: "Chúng tôi sẽ gửi otp mã xác nhận về email của bạn để tăng tính minh bạch bảo mật",
      icon: "warning",
      //@ts-ignore
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          swal("Vâng, chờ xíu nhé tui đang gửi otp");
          this.accountService.forgotpass(this.account.userName).subscribe(value => {
            if (value == true) {
              localStorage.setItem("name", this.account.userName);
              swal("Đã gửi otp, mời bạn xác thực otp và đổi mật khẩu", "", "success")
              this.router.navigate(["/confirm-otp"])
            }
          }, error => {
            swal("lỗi rồi huhu", "", "error")
          });
        } else {
          swal("Vâng bạn chọn hủy!");
        }
      });


  }
}
