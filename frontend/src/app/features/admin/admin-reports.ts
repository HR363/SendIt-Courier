import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Report {
  id: string;
  type: 'Complaint' | 'Feedback';
  user: string;
  message: string;
  date: string;
  status: 'Open' | 'In Progress' | 'Resolved';
}

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-reports.html',
  styleUrls: ['./admin-reports.css']
})
export class AdminReportsComponent {
  reports: Report[] = [
    { id: 'RPT-001', type: 'Complaint', user: 'Alice Smith', message: 'Parcel delayed beyond ETA.', date: '2025-07-20', status: 'Open' },
    { id: 'RPT-002', type: 'Feedback', user: 'Bob Johnson', message: 'Great delivery experience!', date: '2025-07-19', status: 'Resolved' },
    { id: 'RPT-003', type: 'Complaint', user: 'Jane Doe', message: 'Package arrived damaged.', date: '2025-07-18', status: 'In Progress' },
    { id: 'RPT-004', type: 'Feedback', user: 'Sam Lee', message: 'Support was very helpful.', date: '2025-07-17', status: 'Resolved' }
  ];

  setStatus(report: Report, status: Report['status']) {
    report.status = status;
  }
}
