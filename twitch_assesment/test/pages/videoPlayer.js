class VideoPlayer {
  get videoPlayerPause() {
    return $(`//button[@aria-label='Pause']`);
  }
  get videoPlayerContainer() {
    return $(".video-player__container");
  }
}

module.exports = new VideoPlayer();
