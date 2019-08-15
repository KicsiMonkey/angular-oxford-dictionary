import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title: string = 'Angular Oxford Dictionary';

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.setTitle(this.title);
  }

  /**
   * Sets the title of the browser tab.
   * @param newTitle
   */
  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

}
