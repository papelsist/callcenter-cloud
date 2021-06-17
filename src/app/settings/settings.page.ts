import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  appVersion = '1.0.32 (17/06/2021: 16:30:00)';
  constructor() {}

  ngOnInit() {}
}
