import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-game-videos',
  templateUrl: './game-videos.component.html',
  styleUrls: ['./game-videos.component.css']
})
export class GameVideosComponent implements OnInit {
  id ='';

  constructor(public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id']
    });
  }

}
