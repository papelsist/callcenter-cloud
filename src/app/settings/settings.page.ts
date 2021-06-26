import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  appVersion = '1.0.38 (26/06/2021: 09:30:00)';
  constructor() {}

  ngOnInit() {}
}
