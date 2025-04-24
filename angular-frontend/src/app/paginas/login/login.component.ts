import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../shared/services/login.service';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule ,NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  modelo:any;
  boton:any;
  constructor(private loginService:LoginService )
  {
    this.modelo =
    {
      name: "",
      correo:"",
      password:""
    };
    this.boton=0;
  }

  enviar()
  {
    this.boton=1;
    this.loginService.sendData({email:this.modelo.email, password:this.modelo.password}).subscribe({
      next:data=>
        {
          localStorage.setItem("bubooks_id", data.id);
          localStorage.setItem("bubooks_name", data.name);
          localStorage.setItem("bubooks_token", data.token);
          window.location.href="/panel";
        },error:error=>
        {
          alert("ocurrió un error inesperado");
          window.location.href="/login";
          console.log(error);
        }
    });
  }
}
