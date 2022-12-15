import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore'; 
import IClip from '../models/video.model';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  public videoCollection: AngularFirestoreCollection<IClip>

  constructor(private db: AngularFirestore) { 
    this.videoCollection = db.collection('videos');
  }

  async createVideo(data: IClip){
    await this.videoCollection.add(data);
  }
}
