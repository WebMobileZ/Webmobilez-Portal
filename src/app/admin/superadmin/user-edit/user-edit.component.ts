import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UserRestService } from '../user-rest.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  updateUser: FormGroup;
  serverErrors = [];
  @Input() data:any;
  constructor(private route: ActivatedRoute, private userRest: UserRestService, private router: Router) { }

  ngOnInit() {
     let id = this.route.snapshot.params.id;
     this.userRest.editUser(id).subscribe(
      (response) => {
        this.updateUser.patchValue({
          'name': response.user.name,
          'email':response.user.email,
          'role' :response.user.role
        })
      },
      (error) => console.log(error)
    );

      console.log(this.data);

      this.updateUser = new FormGroup({
        'name': new FormControl(null, [Validators.required, Validators.minLength(5)]),
        'email': new FormControl(null, [Validators.required, Validators.email]),
        'password': new FormControl(null),
        'role': new FormControl(null),

      });
  }

  get name() { return this.updateUser.get('name'); }
  get email() { return this.updateUser.get('email'); }
   get password() { return this.updateUser.get('password'); }
   get role() { return this.updateUser.get('role'); }
  updateUserDetails(){
    let id = this.route.snapshot.params.id;
    this.userRest.updateUser(this.updateUser,id).subscribe(
      (response) => {
        console.log(response),
        this.router.navigate(['users/list'])
      },
      error =>{
        this.serverErrors = error.error.errors
      },
      () => console.log('completed')
    );
  }
}
