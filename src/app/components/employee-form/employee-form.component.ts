import {Component, OnInit} from '@angular/core';
import {Employee} from '../../interfaces/employee.interface';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {EmployeeService} from '../../services/employee.service';
import {CommonModule} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatButtonModule} from '@angular/material/button';
import {MatNativeDateModule} from '@angular/material/core';
import {ActivatedRoute, Router} from '@angular/router';

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
    employeeForm!: FormGroup;
    departments = ['HR', 'Development', 'Marketing', 'Finance', 'Sales'];
    statuses = ['active', 'inactive'];
    isEditMode = false;
    currentEmployeeId: number | null = null;

    constructor(
        private fb: FormBuilder,
        private employeeService: EmployeeService,
        public router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.initForm();
        this.checkEditMode();
    }

    private checkEditMode(): void {
        const idParam = this.route.snapshot.paramMap.get('id');

        if (idParam) {
            this.isEditMode = true;
            this.currentEmployeeId = Number(idParam);

            const employee = this.employeeService.getEmployeeById(this.currentEmployeeId);

            if (employee) {
                this.employeeForm.patchValue({
                    name: employee.name,
                    position: employee.position,
                    department: employee.department,
                    email: employee.email,
                    phone: employee.phone,
                    status: employee.status,
                    hireDate: employee.hireDate
                });
            } else {
                this.router.navigate(['/']);
            }
        }
    }

    private initForm(): void {
        this.employeeForm = this.fb.group({
            name: ['', Validators.required],
            position: ['', Validators.required],
            department: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', Validators.required],
            status: ['active', Validators.required],
            hireDate: [new Date(), Validators.required]
        });
    }

    onSubmit(): void {
        if (this.employeeForm.valid) {
            const formValue = this.employeeForm.value;

            if (this.isEditMode && this.currentEmployeeId) {
                const updatedEmployee: Employee = {
                    ...formValue,
                    id: this.currentEmployeeId
                };
                this.employeeService.updateEmployee(updatedEmployee);
            } else {
                const newEmployee: Employee = {
                    ...formValue,
                    id: 0,
                };
                this.employeeService.addEmployee(newEmployee);
            }

            this.router.navigate(['/']);
        }
    }
}
