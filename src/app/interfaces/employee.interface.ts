export interface Employee {
    id: number;
    name: string;
    position: string;
    department: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive';
    hireDate: Date;
}
