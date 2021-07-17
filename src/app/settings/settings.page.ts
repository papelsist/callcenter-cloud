import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  appVersion = '1.0.55 (16/07/2021: 09:40)';

  constructor() {}

  ngOnInit() {}
}
