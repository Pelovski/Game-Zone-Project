import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { VideoService } from 'src/app/services/video.service';
import IVideo from 'src/app/models/video.model';
import { ModalService } from 'src/app/services/modal.service';


@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  videoOrder = '1';
  videos: IVideo[] = [];
  activeVideo: IVideo | null = null;

  constructor(private router: Router, private route: ActivatedRoute, private videoService: VideoService, private modal: ModalService ) {

   }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params: Params) => {
      this.videoOrder = params['sort'] === '2' ? params['sort'] : '1';
    });

    this.videoService.getUserVideos().subscribe(docs =>{
      this.videos = [];

      docs.forEach(doc => {
        this.videos.push({
          docID: doc.id,
          ...doc.data()
        })
      })
    });
  }

  sort(event: Event){
    const { value } =  (event.target as HTMLSelectElement);

    this.router.navigate([],{
      relativeTo: this.route,
      queryParams: {
        sort: value
      }
    });
  }

  openModal($event: Event, video:IVideo){
    $event.preventDefault();

    this.activeVideo = video;

    this.modal.toggleModle('editVideo');
  }

  update($event: IVideo){
    this.videos.forEach((element, index) => {
      if(element.docID == $event.docID){
        this.videos[index].title = $event.title;
      }
    });
  }

  deleteClip($event:Event, video: IVideo){
    $event.preventDefault();
    
    this.videoService.deleteVideo(video);

    this.videos.forEach((element, index) => {
      if(element.docID == video.docID){
        this.videos.splice(index, 1);
      }
    })
  }
  
}
