import {Host, OnDestroy, OnInit, SkipSelf} from '@angular/core';
import {ControlContainer, FormGroup, FormGroupDirective} from '@angular/forms';

export abstract class NestedForm implements OnInit, OnDestroy {
	protected readonly formGroup: FormGroup | undefined;
	protected readonly formGroupName: string | undefined;

	constructor(@Host() @SkipSelf() protected controlContainer: ControlContainer) {}

	public ngOnInit(): void {
		if (this.formGroupName && this.formGroup) {
			const formGroupDirective: FormGroupDirective | undefined = this.getParentFormDirective();
			if (formGroupDirective && !formGroupDirective.form.get(this.formGroupName)) {
				formGroupDirective.form.registerControl(this.formGroupName, this.formGroup);
			}
		}
	}

	public ngOnDestroy(): void {
		const formGroup: FormGroup | undefined = this.getFormGroup();
		if (formGroup && this.formGroupName) {
			const formGroupDirective: FormGroupDirective | undefined = this.getParentFormDirective();
			if (formGroupDirective) {
				formGroupDirective.form.removeControl(this.formGroupName);
			}
		}
	}

	private getParentFormDirective(): FormGroupDirective | undefined {
		return this.controlContainer as FormGroupDirective;
	}

	private getFormGroup(): FormGroup | undefined {
		if (this.formGroupName && this.formGroup) {
			const formGroupDirective: FormGroupDirective | undefined = this.getParentFormDirective();
			if (formGroupDirective) {
				const foundFormGroup: FormGroup | null = formGroupDirective.form.get(this.formGroupName) as FormGroup | null;

				return foundFormGroup ? foundFormGroup : undefined;
			}
		}
	}
}
