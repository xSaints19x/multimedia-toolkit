<h1 align="center">Multimedia Forensics Toolkit Frontend</h1>

This website is built using [Next.js](https://nextjs.org/), [React](https://react.dev/), [Material UI](https://mui.com/), [Tailwind CSS](https://tailwindcss.com/), and is designed to be fast, modern, and responsive.

## Contents

- [Getting Started](#getting-started)
- [Features](#features)
    - [Audio Enhancement](#🎙️-audio-enhancement)  
    - [Image Enhancement](#🖼️-image-enhancement)
    - [Video Enhancement](#🎥-video-enhancement)  
- [How To Use](#how-to-use)
    - [Audio Enhancement](#audio-enhancement)
        - [Trancribe Audio](#transcribe-audio)
        - [De-noise](#de-noise)
    - [Image Enhancement](#image-enhancement)
        - [Motion Deblurring](#motion-deblurring)
        - [Low light enhancement](#low-light-enhancement)
        - [Crop](#crop)
        - [Redaction](#redaction)
    - [Video Enhancement](#video-enhancement)
        - [Convert Format](#convert-format)
        - [Summarization](#summarization)
- [Project Structure](#project-structure)

## 🔧&nbsp;Prerequisites
- FFMPEG

For local deployment, you will need FFMPEG downloaded in your machine. You can follow the guide on the [link](https://ffmpeg.org/download.html) to download it.

## 🚀&nbsp;Getting Started

First, run the command in the terminal to install all of the dependencies you need:

```bash
npm install
```

Next, to run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

### 🖼️&nbsp;Image enhancement 

- Motion deblurring
- Low light enhancement
- Crop
- Redaction

### 🎙️&nbsp;Audio enhancement

- Transcribe Audio
- De-noise [🔨 Work in progress...]

### 🎥&nbsp;Video enhancement

- Convert format
- Summarization [🔨 Work in progress...]

## 📖&nbsp;How To Use

### Audio enhancement
#### `Transcribe Audio` 
1. Click on the `Transcribe Audio` option
2. Click on the `Process Audio` button
3. Wait for the transcript to be produced

> **Note**
> Files available for download after transcription are `txt` and `srt`. 

#### `De-noise` 
[In Progress...]

### Image enhancement 
#### `Motion deblurring`
1. Click on the `Deblurring` option
2. Click on the `Process Image` button
3. Wait for the output to be produced

#### `Low light enhancement`
1. Click on the `Low light` option
2. Click on the `Process Image` button

#### `Crop`
1. Click on the `Crop` option
2. Drag and resize the crop window until satisfied
3. Click on the `Process Image` button

#### `Redaction`
1. Click on the `Redaction` option
2. Click and drag on the area that you wish to redact
3. Repeat step 2 for other areas on the images till complete
4. Click on the `Process Image` button

> **Note**
> Image formats currently supported for download are `jpg`, `png`, `webp`.  

### Video enhancement 
#### `Convert format`
1. Click on the `Convert format` option
2. Click on the desired output format 
3. Click on the `Process Audio` button

> **Note**
> Video formats currently supported for conversion are `mp4`, `mov`, `avi`, `wmv`, `flv`, `webm`, `ogg`, `mkv`. 

#### `Summarization`

## Project Structure

```
├── public         - Used to serve static files e.g images
└── src/app
    ├── components 
    │   ├── audio  - Audio enhancement components
    │   ├── image  - Image enhancement components
    │   └── video  - Video enhancement components
    ├── icons      - Custom SVG Icons used in the project
    └── utils      - Constants and Contexts
```