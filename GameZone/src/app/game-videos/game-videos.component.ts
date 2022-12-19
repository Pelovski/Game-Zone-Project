import { Component, OnInit, ElementRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import IVideo from '../models/video.model';
import videojs from 'video.js';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-game-videos',
  templateUrl: './game-videos.component.html',
  styleUrls: ['./game-videos.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})
export class GameVideosComponent implements OnInit {
  @ViewChild('videoPlayer', { static: true }) target?: ElementRef;
  player?: videojs.Player;
  video?: IVideo

  constructor(public route: ActivatedRoute) { }
  ngOnInit(): void {
    this.player = videojs(this.target?.nativeElement);

    this.route.data.subscribe(data => {
      this.video = data['video'] as IVideo;

      this.player?.src({
        src: this.video.url,
        type: 'video/mp4'
      })
    });
  }
}
