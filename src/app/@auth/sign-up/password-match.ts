import { FormGroup, ValidationErrors } from '@angular/forms';

export function passwordMatch(formGroup: FormGroup): ValidationErrors | null {
  const control = formGroup.controls['password'];
  const matchingControl = formGroup.controls['confirmPassword'];
  if (matchingControl.errors && !matchingControl.errors.mustMatch) {
    // return if another validator has already found an error on the matchingControl
    return null;
  }
  // set error on matchingControl if validation fails
  if (control.value !== matchingControl.value) {
    matchingControl.setErrors({ mustMatch: true });
  } else {
    matchingControl.setErrors(null);
  }
}
