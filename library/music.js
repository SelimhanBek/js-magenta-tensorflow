class Music {
  constructor() {
    this.player = undefined;
    this.rnnPlayer = undefined;
    this.music_rnn = undefined;
    this.vaePlayer = undefined;
    this.music_vae = undefined;
    this.soundFonts = {
      piano:
        "https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus",
    };
    this.musicRNNCheckPoints = {
      basic_rnn:
        "https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn",
      drum_kit_rnn:
        "https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/drum_kit_rnn",
    };
    this.musicVAECheckpoints = {
      mel_4bar_small_q2:
        "https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_4bar_small_q2",
    };
  }

  /* Example Sample */
  twinkle_twinkle() {
    const TWINKLE_TWINKLE = {
      notes: [
        { pitch: 60, startTime: 0.0, endTime: 0.5 },
        { pitch: 60, startTime: 0.5, endTime: 1.0 },
        { pitch: 67, startTime: 1.0, endTime: 1.5 },
        { pitch: 67, startTime: 1.5, endTime: 2.0 },
        { pitch: 69, startTime: 2.0, endTime: 2.5 },
        { pitch: 69, startTime: 2.5, endTime: 3.0 },
        { pitch: 67, startTime: 3.0, endTime: 4.0 },
        { pitch: 65, startTime: 4.0, endTime: 4.5 },
        { pitch: 65, startTime: 4.5, endTime: 5.0 },
        { pitch: 64, startTime: 5.0, endTime: 5.5 },
        { pitch: 64, startTime: 5.5, endTime: 6.0 },
        { pitch: 62, startTime: 6.0, endTime: 6.5 },
        { pitch: 62, startTime: 6.5, endTime: 7.0 },
        { pitch: 60, startTime: 7.0, endTime: 8.0 },
      ],
      totalTime: 8,
    };

    return TWINKLE_TWINKLE;
  }

  /* Set player and play */
  play_twinkle() {
    //this.player = new mm.Player();

    this.player = new mm.SoundFontPlayer(this.soundFonts.piano);

    // Players can also play at a different tempo
    this.player.setTempo(200);

    this.player.start(this.twinkle_twinkle());
    //this.player.stop();
  }

  /* How to draw a midi notes */
  draw_twinkle() {
    const config = {
      noteHeight: 6,
      pixelsPerTimeStep: 50, // like a note width
      noteSpacing: 1,
      noteRGB: "8, 41, 64",
      activeNoteRGB: "240, 84, 119",
    };

    let viz = new mm.PianoRollCanvasVisualizer(
      this.twinkle_twinkle(),
      document.getElementById("Visualizer"),
      config
    );

    let vizPlayer = new mm.Player(false, {
      run: (note) => viz.redraw(note),
      stop: () => {
        console.log("Player stopped!");
      },
    });

    return vizPlayer;
  }

  /* Music RNN is continues given note sequence */
  musicRNN(checkpoint) {
    // Initialize the model.
    this.music_rnn = new mm.MusicRNN(checkpoint);
    this.music_rnn.initialize();

    // Create a player to play the sequence we'll get from the model.
    this.rnnPlayer = new mm.SoundFontPlayer(this.soundFonts.piano);
  }

  /* Play with MusicRNN */
  play_initalized_MusicRNN() {
    /* If the player is already playing then kill */
    if (this.rnnPlayer.isPlaying()) {
      this.rnnPlayer.stop();
      return;
    }

    /* Some configurations */
    let rnn_steps = 20; // --> Steps of contunied sequence
    let rnn_temperature = 1.5; // --> Similarity ratio

    /* The model expects a quantized sequence, and ours was unquantized: */
    const qns = mm.sequences.quantizeNoteSequence(this.twinkle_twinkle(), 4);
    this.music_rnn
      .continueSequence(qns, rnn_steps, rnn_temperature)
      .then((sample) => {
        this.rnnPlayer.start(sample);
      });
  }

  /* Music VAE generates brand new NoteSequences or interpolates between two sequences. */
  musicVAE(checkpoint) {
    // Initialize the model.
    this.music_vae = new mm.MusicVAE(checkpoint);
    this.music_vae.initialize();

    // Create a player to play the sampled sequence.
    this.vaePlayer = new mm.SoundFontPlayer(this.soundFonts.piano);
  }

  /* Play Initialized MusicVAE */
  playVAE() {
    let vae_temperature = 1.5; // randomness of the result

    if (this.vaePlayer.isPlaying()) {
      this.vaePlayer.stop();
      return;
    }
    this.music_vae.sample(1, vae_temperature).then((sample) => {
      this.vaePlayer.start(sample[0]);
      console.log(sample);
    });
  }
}
