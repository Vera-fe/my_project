import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Employee} from '../../models/employee.model';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {EmployeeService} from '../../services/employee.service';
import {CommonModule} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatButtonModule} from '@angular/material/button';
import {MatNativeDateModule} from '@angular/material/core';
import {Router} from '@angular/router';

@Component({
    selector: 'app-employee-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatButtonModule,
        MatNativeDateModule
    ],
    templateUrl: './employee-form.component.html',
    styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {
    @Input() employee: Employee | null = null;
    @Output() formSubmit = new EventEmitter<Employee>();

    employeeForm!: FormGroup;
    departments = ['HR', 'Development', 'Marketing', 'Finance', 'Sales'];
    statuses = ['active', 'inactive'];

    // Изменено с private на public
    constructor(
        private fb: FormBuilder,
        private employeeService: EmployeeService,
        public router: Router    // Теперь router публичный
    ) { }

    ngOnInit(): void {
        this.initForm();
    }

    private initForm(): void {
        this.employeeForm = this.fb.group({
            name: [this.employee?.name || '', Validators.required],
            position: [this.employee?.position || '', Validators.required],
            department: [this.employee?.department || '', Validators.required],
            email: [this.employee?.email || '', [Validators.required, Validators.email]],
            phone: [this.employee?.phone || '', Validators.required],
            status: [this.employee?.status || 'active', Validators.required],
            hireDate: [this.employee?.hireDate || new Date(), Validators.required]
        });
    }

    onSubmit(): void {
        if (this.employeeForm.valid) {
            const formValue = this.employeeForm.value;
            const employee: Employee = {
                ...formValue,
                id: this.employee?.id || 0
            };

            if (this.employee) {
                this.employeeService.updateEmployee(employee);
            } else {
                this.employeeService.addEmployee(employee);
            }

            this.router.navigate(['/']);
        }
    }
}
