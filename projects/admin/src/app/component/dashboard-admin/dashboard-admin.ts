import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import {
  Chart,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  LineElement,
  PointElement,
  ArcElement,
  DoughnutController,
  RadialLinearScale,
} from 'chart.js';

Chart.register(
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  LineElement,
  PointElement,
  ArcElement,
  DoughnutController,
  RadialLinearScale,
);

interface Task {
  id: number;
  title: string;
  project: string;
  status: 'completed' | 'in-progress' | 'pending' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: Date;
  progress: number;
  estimatedHours: number;
  actualHours: number;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  avatar: string;
  completedTasks: number;
  pendingTasks: number;
  productivity: number;
}

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, FormsModule],
  templateUrl: './dashboard-admin.html',
  // If you want to add the CSS styles to this component, uncomment and add this:
  // styles: [`
  //   .hover-scale {
  //     transition: transform 0.2s ease, box-shadow 0.2s ease;
  //   }
  //   .hover-scale:hover {
  //     transform: translateY(-2px);
  //     box-shadow: 0 .5rem 1rem rgba(0,0,0,.15) !important;
  //   }
  //   .hover-row {
  //     transition: background-color 0.15s ease;
  //   }
  //   .hover-row:hover {
  //     background-color: rgba(13, 110, 253, 0.04) !important;
  //   }
  //   .progress-bar {
  //     transition: width 0.6s ease;
  //   }
  //   .badge {
  //     font-weight: 500;
  //   }
  //   .table thead th {
  //     font-weight: 600;
  //     text-transform: uppercase;
  //     font-size: 0.75rem;
  //     letter-spacing: 0.5px;
  //     color: #6c757d;
  //   }
  //   .rounded-pill {
  //     border-radius: 50rem !important;
  //   }
  // `]
})
export class DashboardAdmin implements OnInit {
  // Quick Stats
  quickStats = [
    {
      title: 'Total Tasks',
      value: 156,
      icon: 'bi-clipboard-check',
      color: 'primary',
      change: '+12%',
      isPositive: true,
    },
    {
      title: 'Completed',
      value: 89,
      icon: 'bi-check-circle',
      color: 'success',
      change: '+8%',
      isPositive: true,
    },
    {
      title: 'In Progress',
      value: 42,
      icon: 'bi-arrow-clockwise',
      color: 'warning',
      change: '+15%',
      isPositive: true,
    },
    {
      title: 'Overdue',
      value: 25,
      icon: 'bi-exclamation-triangle',
      color: 'danger',
      change: '-3%',
      isPositive: false,
    },
  ];

  // Task Status Chart (Doughnut)
  taskStatusChartData = {
    labels: ['Completed', 'In Progress', 'Pending', 'Overdue'],
    datasets: [
      {
        data: [89, 42, 25, 25],
        backgroundColor: [
          'rgba(40, 167, 69, 0.9)',
          'rgba(255, 193, 7, 0.9)',
          'rgba(13, 110, 253, 0.9)',
          'rgba(220, 53, 69, 0.9)',
        ],
        borderColor: ['#28a745', '#ffc107', '#0d6efd', '#dc3545'],
        borderWidth: 2,
        hoverOffset: 15,
      },
    ],
  };

  taskStatusChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label;
            const value = context.raw;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Task Priority Chart (Bar)
  taskPriorityChartData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        label: 'Tasks',
        data: [45, 68, 43],
        backgroundColor: [
          'rgba(220, 53, 69, 0.7)',
          'rgba(255, 193, 7, 0.7)',
          'rgba(40, 167, 69, 0.7)',
        ],
        borderColor: ['#dc3545', '#ffc107', '#28a745'],
        borderWidth: 1,
      },
    ],
  };

  taskPriorityChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10,
        },
        grid: {
          display: true,
          color: 'rgba(0,0,0,0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Team Performance Chart (Line)
  teamPerformanceChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: [65, 78, 66, 82, 90, 95],
        borderColor: '#0d6efd',
        backgroundColor: 'rgba(13, 110, 253, 0.1)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Tasks Created',
        data: [70, 82, 75, 88, 92, 98],
        borderColor: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  teamPerformanceChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.05)',
        },
      },
      x: {
        grid: {
          color: 'rgba(0,0,0,0.05)',
        },
      },
    },
  };

  // Recent Tasks
  recentTasks: Task[] = [
    {
      id: 1,
      title: 'Implement User Authentication',
      project: 'Project Alpha',
      status: 'in-progress',
      priority: 'high',
      assignee: 'Aya Taha',
      dueDate: new Date('2024-12-20'),
      progress: 75,
      estimatedHours: 8,
      actualHours: 6,
    },
    {
      id: 2,
      title: 'Design Dashboard UI',
      project: 'Project Beta',
      status: 'completed',
      priority: 'medium',
      assignee: 'Jane Smith',
      dueDate: new Date('2024-12-15'),
      progress: 100,
      estimatedHours: 12,
      actualHours: 10,
    },
    {
      id: 3,
      title: 'Fix Mobile Responsiveness',
      project: 'Project Gamma',
      status: 'pending',
      priority: 'high',
      assignee: 'sayed osama',
      dueDate: new Date('2024-12-18'),
      progress: 30,
      estimatedHours: 6,
      actualHours: 2,
    },
    {
      id: 4,
      title: 'Write Documentation',
      project: 'Project Alpha',
      status: 'overdue',
      priority: 'low',
      assignee: 'Aya osama',
      dueDate: new Date('2024-12-10'),
      progress: 50,
      estimatedHours: 4,
      actualHours: 2,
    },
    {
      id: 5,
      title: 'Database Optimization',
      project: 'Project Delta',
      status: 'in-progress',
      priority: 'medium',
      assignee: 'EmilyDavis',
      dueDate: new Date('2024-12-25'),
      progress: 60,
      estimatedHours: 10,
      actualHours: 6,
    },
  ];

  // Team Members
  teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'John Doe',
      role: 'Frontend Developer',
      avatar: 'JD',
      completedTasks: 24,
      pendingTasks: 3,
      productivity: 92,
    },
    {
      id: 2,
      name: 'Jane Smith',
      role: 'UI/UX Designer',
      avatar: 'JS',
      completedTasks: 32,
      pendingTasks: 2,
      productivity: 95,
    },
    {
      id: 3,
      name: 'Mike Johnson',
      role: 'Backend Developer',
      avatar: 'MJ',
      completedTasks: 18,
      pendingTasks: 5,
      productivity: 88,
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      role: 'Project Manager',
      avatar: 'SW',
      completedTasks: 28,
      pendingTasks: 4,
      productivity: 90,
    },
  ];

  // Chart type selectors
  selectedTimeRange: string = 'monthly';

  // Add today property
  today = new Date();

  ngOnInit() {
    // Initialization code if needed
  }

  getPriorityBadgeClass(priority: string): string {
    switch (priority) {
      case 'high':
        return 'bg-danger bg-opacity-10 text-danger';
      case 'medium':
        return 'bg-warning bg-opacity-10 text-warning';
      case 'low':
        return 'bg-success bg-opacity-10 text-success';
      default:
        return 'bg-secondary bg-opacity-10 text-secondary';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-success bg-opacity-10 text-success';
      case 'in-progress':
        return 'bg-warning bg-opacity-10 text-warning';
      case 'pending':
        return 'bg-info bg-opacity-10 text-info';
      case 'overdue':
        return 'bg-danger bg-opacity-10 text-danger';
      default:
        return 'bg-secondary bg-opacity-10 text-secondary';
    }
  }

  getStatusText(status: string): string {
    return status.replace('-', ' ').toUpperCase();
  }

  getPriorityText(priority: string): string {
    return priority.toUpperCase();
  }

  getProgressBarClass(progress: number): string {
    if (progress >= 80) return 'bg-success';
    if (progress >= 50) return 'bg-warning';
    return 'bg-danger';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }

  isDueSoon(date: Date): boolean {
    const today = new Date();
    const dueDate = new Date(date);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  }

  isOverdue(date: Date): boolean {
    return new Date(date) < new Date();
  }

  getAvatarColor(name: string): string {
    const colors = [
      'bg-primary bg-opacity-10 text-primary',
      'bg-success bg-opacity-10 text-success',
      'bg-warning bg-opacity-10 text-warning',
      'bg-info bg-opacity-10 text-info',
      'bg-danger bg-opacity-10 text-danger',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  }

  getProductivityClass(productivity: number): string {
    if (productivity >= 90) return 'text-success';
    if (productivity >= 80) return 'text-warning';
    return 'text-danger';
  }
}
