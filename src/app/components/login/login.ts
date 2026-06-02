import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgIf, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { ProductoService } from '../../services/producto';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgIf, NgClass],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isRegister = false;
  showLoginPassword = false;
  showRegisterPassword = false;
  showConfirmPassword = false;
  
  // Requisitos de contraseña
  passwordRequirements = {
    minLength: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  };

  constructor(private fb: FormBuilder, private router: Router, private productoService: ProductoService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.registerForm = this.fb.group(
      {
        nombre: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, this.passwordValidator.bind(this)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  // Validador personalizado para la contraseña
  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    
    this.passwordRequirements = {
      minLength: password?.length >= 12 || false,
      hasUpperCase: /[A-Z]/.test(password) || false,
      hasNumber: /[0-9]/.test(password) || false,
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) || false,
    };

    // Validar que todos los requisitos se cumplan
    const allRequirementsMet = Object.values(this.passwordRequirements).every(req => req);
    
    return allRequirementsMet ? null : { passwordRequirements: true };
  }

  updatePasswordRequirements() {
    const passwordControl = this.registerForm.get('password');
    if (passwordControl) {
      this.passwordValidator(passwordControl);
    }
  }

  toggleTab() {
    this.isRegister = !this.isRegister;
  }

  toggleLoginPassword() {
    this.showLoginPassword = !this.showLoginPassword;
  }

  toggleRegisterPassword() {
    this.showRegisterPassword = !this.showRegisterPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  login() {
  if (this.loginForm.valid) {
    const datosBackend = {
      correo: this.loginForm.value.email,
      contrasena: this.loginForm.value.password
    };

    this.productoService.login(datosBackend).subscribe({
      next: (res: any) => {
        console.log('Respuesta del backend:', res);
        localStorage.setItem('token', res.token); // Guardar token si es necesario
        this.router.navigate(['/listar-productos']);
      },
      error: () => {
        alert('Credenciales incorrectas');
      }
    });
  }
}

  register() {
  if (this.registerForm.valid) {
    const { confirmPassword, ...datos } = this.registerForm.value;
    
    // Mapear campos al formato que espera el backend
    const datosBackend = {
      nombreCompleto: datos.nombre,
      correo: datos.email,
      contrasena: datos.password,
      confirmarContrasena: confirmPassword
    };

    this.productoService.register(datosBackend).subscribe({
      next: () => {
        alert('¡Cuenta creada! Ahora inicia sesión.');
        this.toggleTab();
      },
      error: () => {
        alert('Error al registrarse');
      }
    });
  }
}
}
