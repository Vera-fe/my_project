import {Component, OnInit} from '@angular/core';
import {EmployeeService} from '../../services/employee.service';
import {Employee} from '../../models/employee.model';
import {Observable, map} from 'rxjs';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {RouterModule} from '@angular/router';
import {EmployeeFilterComponent} from "../employee-filter/employee-filter.component";

@Component({
    selector: 'app-employee-list',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        RouterModule,
        EmployeeFilterComponent
    ],
    templateUrl: './employee-list.component.html',
    styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
    employees$!: Observable<Employee[]>;
    displayedColumns: string[] = ['id', 'name', 'position', 'department', 'status', 'actions'];

    constructor(private employeeService: EmployeeService) { }

    ngOnInit(): void {
        this.employees$ = this.employeeService.getEmployees();
    }

    deleteEmployee(id: number): void {
        if (confirm('Are you sure you want to delete this employee?')) {
            this.employeeService.deleteEmployee(id);
        }
    }

    applyFilter(filterData: any): void {
        this.employees$ = this.employeeService.getEmployees().pipe(
            map(employees => employees.filter(employee => {
                const nameMatch = !filterData.name ||
                    employee.name.toLowerCase().includes(filterData.name.toLowerCase());
                const departmentMatch = !filterData.department ||
                    employee.department === filterData.department;
                const statusMatch = !filterData.status ||
                    employee.status === filterData.status;
                return nameMatch && departmentMatch && statusMatch;
            }))
        );
    }
}
