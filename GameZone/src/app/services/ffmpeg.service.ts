import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root'
})
export class FfmpegService {
  isRunnung = false;
  isReady = false;
  private ffmpge;

  constructor() {
    this.ffmpge = createFFmpeg({ log: true }); // able to debug the logs
  }

  // Downloading the WebAssembly file / Async because is 25MB
  async init() {
    if (this.isReady) {
      return;
    }

    await this.ffmpge.load();

    this.isReady = true;

  }

  // Store the file in FFmpeg separate memory storage
  async getScreenshots(file: File) {
    this.isRunnung = true;
    //Convert the file to binary data
    const data = await fetchFile(file);

    //Give us access to the packages memory sistem / Write the file
    this.ffmpge.FS('writeFile', file.name, data);

    const secounds = [1, 2, 3]; // We need 3 pictures in the first 3 sec
    const commands: string[] = [];  // List of commands to run with ffmpeg


    // One item, one screenshot
    secounds.forEach(second => {
      commands.push(

        // Input
        '-i', file.name, // find the file

        //Output Options
        '-ss', `00:00:0${second}`, // Changing current timestamp / hh:mm:ss takes the picture from 01,02,03.. sec.
        '-frames:v', '1', // Foucus the the single frame
        '-filter:v', 'scale=510:-1',   //Resizing a image requers a filter / We are modify the size / width: height

        //Output
        `output_0${second}.png` // We save the frame to output_01.png
      );
    });

    //Expects a list of strings
    await this.ffmpge.run(
      ...commands
    );
    const screenshots: string[] = []; // Pushing the URLs into this arr / from binary to string

    //get same numer of URLs 
    secounds.forEach(second => {
      const screenShotFile = this.ffmpge.FS('readFile', `output_0${second}.png`); // Take file from the file system
      const screenshotBlob = new Blob(

        // Buffer contains the actual data of the file / Obj is an additional list of info about the file / For the browser we need to give the type
        [screenShotFile.buffer], {
        type: 'image/png'
      }
      );

      const screenshotURL = URL.createObjectURL(screenshotBlob); // create a URL to a Blob

      screenshots.push(screenshotURL);  // add the URL in te Array
    });

    this.isRunnung = false;

    return screenshots;
  }
}
