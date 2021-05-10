import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  appVersion = '1.0.24 (08/05/2021: 15:00)';
  constructor() {}

  ngOnInit() {}
}
