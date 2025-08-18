import {Component, EventEmitter, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
    selector: 'app-employee-filter',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './employee-filter.component.html',
    styleUrls: ['./employee-filter.component.scss']
})
export class EmployeeFilterComponent {
    @Output() filterChange = new EventEmitter<any>();
    filterForm: FormGroup;
    departments = ['HR', 'Development', 'Marketing', 'Finance', 'Sales'];
    statuses = ['active', 'inactive'];

    constructor(private fb: FormBuilder) {
        this.filterForm = this.fb.group({
            name: [''],
            department: [''],
            status: ['']
        });

        this.filterForm.valueChanges.subscribe(value => {
            this.filterChange.emit(value);
        });
    }

    clearFilters(): void {
        this.filterForm.reset();
    }
}
