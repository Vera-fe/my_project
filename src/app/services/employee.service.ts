import {Injectable} from '@angular/core';
import {Employee} from '../interfaces/employee.interface';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    private employees: Employee[] = [];
    private employeesSubject = new BehaviorSubject<Employee[]>(this.employees);
    private storageKey = 'employees_data';

    constructor() {
        this.loadFromLocalStorage();
        this.setupStorageListener();
    }

    private loadFromLocalStorage(): void {
        const storedData = localStorage.getItem(this.storageKey);
        if (storedData) {
            this.employees = JSON.parse(storedData);
            this.employeesSubject.next([...this.employees]);
        }
    }

    private setupStorageListener(): void {
        window.addEventListener('storage', (event) => {
            if (event.key === this.storageKey) {
                this.loadFromLocalStorage();
            }
        });
    }

    private updateLocalStorage(): void {
        localStorage.setItem(this.storageKey, JSON.stringify(this.employees));
        this.employeesSubject.next([...this.employees]);
    }

    getEmployees(): Observable<Employee[]> {
        return this.employeesSubject.asObservable();
    }

    getEmployeeById(id: number): Employee | undefined {
        return this.employees.find(employee => employee.id === id);
    }

    addEmployee(employee: Employee): void {
        employee.id = this.generateId();
        this.employees.push(employee);
        this.updateLocalStorage();
    }

    updateEmployee(updatedEmployee: Employee): void {
        const index = this.employees.findIndex(e => e.id === updatedEmployee.id);
        if (index !== -1) {
            this.employees[index] = updatedEmployee;
            this.updateLocalStorage();
        }
    }

    deleteEmployee(id: number): void {
        this.employees = this.employees.filter(e => e.id !== id);
        this.updateLocalStorage();
    }

    private generateId(): number {
        return this.employees.length > 0
            ? Math.max(...this.employees.map(e => e.id)) + 1
            : 1;
    }
}
