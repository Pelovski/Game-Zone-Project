import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore'; 
import IVideo from '../models/video.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  public videoCollection: AngularFirestoreCollection<IVideo>

  constructor(private db: AngularFirestore, private auth: AngularFireAuth, private storage: AngularFireStorage) { 
    this.videoCollection = db.collection('videos');
  }

   createVideo(data: IVideo) : Promise<DocumentReference<IVideo>>{
    return this.videoCollection.add(data);
  }

  getUserVideos(){
    return this.auth.user.pipe(
      switchMap(user => {
        if(!user){
          return of([])
        }

        const query = this.videoCollection.ref.where(
          'uid', '==', user.uid
        );

        return query.get();
      }),
      map(snapshot => (snapshot as QuerySnapshot<IVideo>).docs)
    );
  }

  updateVideo(id: string, title: string){
    return this.videoCollection.doc(id).update({
      title
    });
  }

  async deleteVideo(video: IVideo){
    const videoRef = this.storage.ref(`videos/${video.fileName}`);

    await videoRef.delete();

    await this.videoCollection.doc(video.docID).delete();
  }
}
