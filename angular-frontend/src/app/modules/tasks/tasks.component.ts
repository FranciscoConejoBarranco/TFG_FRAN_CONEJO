
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../shared/services/task-service.service';
import { Task } from '../../shared/interfaces/task';
import { RouterModule } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';


@Component({
  selector: 'app-tasks',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})

export class TasksComponent implements OnInit {

  tasks: Task[] = [];
  taskForm: FormGroup;

  constructor(private taskService: TaskService) {
    this.taskForm = new FormGroup({
      title: new FormControl('',[Validators.required, Validators.minLength(3)])
    });
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(
      (tasks) => this.tasks = tasks,
      (error) => console.error('Error fetching tasks:', error)
    );
  }

  addTask(): void {
    if (this.taskForm.invalid) return;
    
    const newTask: Task = {
       id: 0, 
       title: this.taskForm.value.title, 
       completed: false 
      };

    this.taskService.addTask(newTask).subscribe(() => 
      {
        this.loadTasks();
        this.taskForm.reset();
      });
  }
  

  toggleTask(task: Task): void {
    task.completed = !task.completed;
    this.taskService.updateTask(task).subscribe(() => this.loadTasks());
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe(() => this.loadTasks());
  }
}


