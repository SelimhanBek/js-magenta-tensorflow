class Application {
  constructor() {
    this.components = new Components();
    this.music = new Music();
  }
  initalize() {
    const self = this;

    /* Draw notes to canvas */
    let vizPlayer = self.music.draw_twinkle();

    /* Initialize Music RNN */
    self.music.musicRNN(self.music.musicRNNCheckPoints.basic_rnn);

    /* Initialize Music VAE */
    self.music.musicVAE(self.music.musicVAECheckpoints.mel_4bar_small_q2);

    let btn = document.getElementById("PlayBtn");
    btn.onclick = function () {
      vizPlayer.start(self.music.twinkle_twinkle());
    };

    let rnnBtn = document.getElementById("MusicRNN");
    rnnBtn.onclick = function () {
      self.music.play_initalized_MusicRNN();
    };

    let vaeBtn = document.getElementById("MusicVAE");
    vaeBtn.onclick = function () {
      self.music.playVAE();
    };
  }
}

const app = new Application();
app.initalize();
