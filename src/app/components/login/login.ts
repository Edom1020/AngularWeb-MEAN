import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgIf, NgClass } from '@angular/common';
import { Router } from '@angular/router';

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

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.registerForm = this.fb.group(
      {
        nombre: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
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
      const usuario = this.loginForm.value;
      console.log('Login:', usuario);
      alert(`¡Bienvenido ${usuario.email}!`);
      // Aquí irían las llamadas a la API
      this.router.navigate(['/']);
    }
  }

  register() {
    if (this.registerForm.valid) {
      const usuario = this.registerForm.value;
      console.log('Registro:', usuario);
      alert(`¡Cuenta creada exitosamente! Bienvenido ${usuario.nombre}`);
      // Aquí irían las llamadas a la API
      this.router.navigate(['/']);
    }
  }
}
