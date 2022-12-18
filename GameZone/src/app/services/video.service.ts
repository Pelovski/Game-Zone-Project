import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore';
import IVideo from '../models/video.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap, map } from 'rxjs/operators';
import { of, lastValueFrom } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class VideoService implements Resolve<IVideo | null>{
  public videosCollection: AngularFirestoreCollection<IVideo>
  pageVideos: IVideo[] = [];
  pendingReq = false;

  constructor(private db: AngularFirestore, private auth: AngularFireAuth, private storage: AngularFireStorage, private router: Router) {
    this.videosCollection = db.collection('videos');
  }

  createVideo(data: IVideo): Promise<DocumentReference<IVideo>> {
    return this.videosCollection.add(data);
  }

  getUserVideos() {
    return this.auth.user.pipe(
      switchMap(user => {
        if (!user) {
          return of([])
        }

        const query = this.videosCollection.ref.where(
          'uid', '==', user.uid
        );

        return query.get();
      }),
      map(snapshot => (snapshot as QuerySnapshot<IVideo>).docs)
    );
  }

  updateVideo(id: string, title: string) {
    return this.videosCollection.doc(id).update({
      title
    });
  }

  async deleteVideo(video: IVideo) {
    const videoRef = this.storage.ref(`videos/${video.fileName}`);
    const screenshotRef = this.storage.ref(
      `screenshots/${video.screenshotFileName}`
    );

    await videoRef.delete();
    await screenshotRef.delete();

    await this.videosCollection.doc(video.docID).delete();
  }

  async getVideos() {

    if (this.pendingReq) {
      return
    }

    this.pendingReq = true;
    //Take the newes video
    let query = this.videosCollection.ref.orderBy('timestamp', 'desc').limit(3);

    const { length } = this.pageVideos;


    if (length) {
      const lastDocID = this.pageVideos[length - 1].docID;
      const docs = this.videosCollection.doc(lastDocID).get();
      const lastDoc = await lastValueFrom(docs);

      query = query.startAfter(lastDoc);
    }

    const snapshot = await query.get();

    snapshot.forEach(doc => {
      this.pageVideos.push({
        docID: doc.id,
        ...doc.data()
      })
    });

    this.pendingReq = false;
  }

  //route - Sotres information on the current route being visited
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    return this.videosCollection.doc(route.params['id']).get().pipe(
      map(snapshot =>{
        const data = snapshot.data();

        if(!data){
          this.router.navigate(['/']);
          return null;
        }
        return data;
      })
    );
  }
}
