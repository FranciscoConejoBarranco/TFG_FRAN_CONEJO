import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { inject } from '@angular/core';
import { RegistroService } from '../../shared/services/registro.service';

@Component({
  selector: 'app-registro',
  imports: [RouterModule, FormsModule,],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  modelo: any;
  boton:any;
  registroService=inject(RegistroService);

  constructor(){
    this.modelo =
    {
      name: "",
      email:"",
      password:""
    };
    this.boton=0;
  }

  enviar()
  {
    this.boton=1;
    this.registroService.sendData({ name:this.modelo.name, email:this.modelo.email, password:this.modelo.password }).subscribe(
      {
        next:data=>
          {
            alert("Te has registrado exitosamente\nHemos enviado un email para activar su cuenta");
            setInterval(() => {
              window.location.href="/registro";
            }, 2000);
          },error:error=>
          {
            alert("ocurrió un error inesperado");
            window.location.href="/registro";
            console.log(error);
          }
      });
  }


}
