# Idea:
To create decoupled components which handle and map their own data for the store regardless of parent or parent tree component structure
Automatically bubble data to the store without needing to worry about data transformation on the way up to the store

# Usage:
Extending a given component from the class import {NestedForm} from '@destimo/desti-util'; allows sub components to attach and append it's own `FormGroup` to the parent (host) form and therefore automatically subscribe and push changes to the store.

Sub (Child) Component:
```
export class MySubComponent extends NestedForm {

    /* 2 properties as defined by the class: NestedForm */

    public readonly formGroup: FormGroup;
    protected readonly formGroupName = 'mySubComponentForm';

    constructor(private readonly fb: FormBuilder, protected controlContainer: ControlContainer) {
        super(controlContainer);

        this.formGroup = this.fb.group({
            firstName: this.fb.control(''),
            lastName: this.fb.control(''),
        });


        this.formGroup.valueChanges.subscribe({
            next: (data) => {
                /* manipulated the form data on the way up */

               data.firstName = data.firstName.upperCase();
                this.formGroup.patchValue(data, {emitEvent: false});
            }
        });
    }

}
```


The parent component is defined as follows:
```
class ParentComponent implements OnDestroy, OnChanges {
    public formGroup: FormGroup;

    constructor(private readonly fb: FormBuilder) {

        /* after init 'this.formGroup' also contains the FormGroup 'mySubComponentForm' and its controls */
        this.formGroup = new FormGroup({
            someOtherControl: this.fb.control(''),
        });

        this.formGroup.valueChanges.pipe(untilComponentDestroyed(this)).subscribe((data) => {

            /* this.changes pushes all form data (including sub forms) to the store */

            /* 'data' contains all sub (child) form data too */
            this.changes.emit(data);
        });
    }

}
```
In order to link the two components to each other and their forms, simply insert the sub (child) component into the parent's template:

ParentComponent.html:
```
<my-sub-component></my-sub-component>
```
