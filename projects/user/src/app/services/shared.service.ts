import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private taskcount = new BehaviorSubject<number>(0);
  currentTaskCount= this.taskcount.asObservable();
  updateTask(count:number){
    this.taskcount.next(count)
  }
}
