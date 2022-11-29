import { ValidationErrors, AbstractControl, ValidatorFn} from "@angular/forms";

export class RegisterValidators {
    
    // validating password fields
    //AbstractControl - Give us access to form properties

    static match(contorlName: string, matchingControlName: string): ValidatorFn{
        
        return (group: AbstractControl): ValidationErrors | null =>{
            const control = group.get(contorlName); // get property
            const matchingControl = group.get(matchingControlName); // get confirm property
    
            if(!control || !matchingControl){
                // check if property are empty
                return { controlNotFound: false }
            }
    
            // check if property are euqual
            const error = control.value === matchingControl.value ? null:
             { noMatch: true };

             matchingControl.setErrors(error);
            
             return error;
        }
        
    }
}


