// ==UserScript==
// @name        BetterHeartRate - hyperate.io
// @namespace   github.com/victornpb
// @match       https://app.hyperate.io/*
// @grant       none
// @version     1.2
// @author      github.com/Victornpb
// ==/UserScript==

(function() {
    'use strict';

    // Add the CSS styles to the head of the document
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
    #myheartrate{
      position: absolute;
      top: 0px;
      bottom: 0px;
      left: 0px;
      right: 0px;

      font-family: Arial, sans-serif;
      text-align: center;
      background-color: #111;
      color: #fff;
      margin: 0;
      padding: 20px;

      display: flex;
      justify-content: space-evenly;
      align-items: center;
      flex-direction: column;
    }

    #heartContainer {
      position: relative;
      width: 100%;
      height: 150px;
      text-align: center;
    }

    #heart {
      position: absolute;
      top: 0;
      left: 50%;
      margin-left: -75px;
      width: 150px;
      height: 150px;
      fill: red;
      opacity: 0.8;
      /* animation: heartbeat 1s infinite; */
      will-change: transform;
    }

    @keyframes heartbeat {
      0% {
        transform: scale(1);
      }

      15% {
        transform: scale(0.85);
      }

      30% {
        transform: scale(1);
      }

      35% {
        transform: scale(1.05);
      }

      40% {
        transform: scale(1);
      }
    }

    #heartRate {
      font-size: 48px;
      margin-top: 20px;
      color: #aaa;
    }

    #lastUpdate {
      font-size: 16px;
      margin-top: 32px;
      color: #666;
    }

    .simulated {
      position: absolute;
      bottom: 10px;
    }

    .error {
      color: red;
    }
    `;
    document.head.appendChild(styleElement);

    // Create a script element and set its content to the original script
    const div = document.createElement('div');
    div.innerHTML = `

        <div id="myheartrate">
            <div>
                <div id="heartContainer">
                  <svg id="heart" viewBox="0 0 512 512">
                    <path d="M464.1,64.4c-49.3-47.9-128.9-47.9-178.1,0L256,81.7L225.9,64.4c-49.3-47.9-128.9-47.9-178.1,0
                    c-55.1,53.7-54.7,141.4,1.8,194.8l200.7,194.8c4.7,4.6,10.7,6.9,16.7,6.9s12-2.3,16.7-6.9l200.7-194.8
                    C518.8,205.8,519.4,118.1,464.1,64.4z" />
                  </svg>
                </div>

                <div id="heartRate">Loading...</div>
             </div>

            <div>
              <canvas width="800" height="200" id="heartbeat"></canvas>

              <div id="lastUpdate">Last Update: -</div>
            </div>

            <div class="simulated">
              Simulate
              <input id="simulated" type="checkbox">
              <input id="slider" type="number" min="30" max="250" value="90">
            </div>
          </div>

    `;
    document.body.appendChild(div.firstElementChild);






class VirtualHeart {
      #bpm = 90;
      #value = 0;
      #currentIndex = 0;
      #lastTick = 0;
      #waveDuration = 666;
      #waveform = [
        -0.3899762125623386, -0.3899762125623386, -0.4003361468024722, -0.359631156951167, -0.4142596045223683,
        -0.3121664936949514, -0.4316547423333731, -0.27930492923466876, 0.23474251705990934, 1, 0.9024806899275357,
        0.7110055932623691, 0.12438350125366249, -0.6936104554513642, -0.9299969691681743, -1, -0.9464736730926422,
        -0.7233677133751526, -0.33154544870087543, -0.36418658902838874, -0.24502897658912026, -0.4168312194046708,
      ];

      constructor() {
        console.log('Heart started');
        this.tick();
      }

      // simulation tick
      tick() {
        const tickInterval = this.#waveDuration / this.#waveform.length;
        const now = Date.now();

        if (now > this.#lastTick + tickInterval) {
          this.#lastTick = now;

          this.#value = this.#waveform[this.#currentIndex];
          this.#currentIndex = (this.#currentIndex + 1) % this.#waveform.length;
        }

        setTimeout(() => this.tick(), tickInterval / 10);
      }

      setBpm(bpm) {
        this.#bpm = bpm;
        this.#waveDuration = (60 / bpm) * 1000;
      }

      readSignal() {
        return this.#value;
      }

      getBpm() {
        return this.#bpm;
      }
    }


    class ECGMonitor {
      constructor() {
        this.canvas = document.getElementById("heartbeat");
        this.ctx = this.canvas.getContext("2d");
        this.paddingH = 30;
        this.paddingV = 2;
        this.blurredCircleRadius = 3;
        this.pulseWidth = Math.round(0.8 * (this.canvas.width - this.paddingH * 2));
        this.buffer = [0];
        this.buffer2 = [0];


        this.gradient = this.ctx.createRadialGradient(this.blurredCircleRadius, this.blurredCircleRadius, 0, this.blurredCircleRadius, this.blurredCircleRadius, this.blurredCircleRadius);
        this.gradient.addColorStop(0, 'rgba(255,255,255,1)');
        this.gradient.addColorStop(0.5, 'rgba(228,255,255,.3)');
        this.gradient.addColorStop(1, 'rgba(228,255,255,0)');

        this.drawGrayLines = this.drawGrayLines.bind(this);
        this.drawPulse = this.drawPulse.bind(this);
        this.render = this.render.bind(this);

        this.render();
      }

      drawGrayLines() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const ph = this.paddingH;
        const pv = this.paddingV;
        const ml = -1;
        const mr = 30;

        const bh = (h - this.paddingV);
        const bw = 6;

        this.ctx.save();
        this.ctx.strokeStyle = "#7e90a6";
        this.ctx.lineWidth = 1;

         // left bracket
        this.ctx.beginPath();
        this.ctx.moveTo(ml + ph + 0, pv + 0);
        this.ctx.lineTo(ml + ph + bw, pv + 0);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(ml + ph + 0, pv + 0);
        this.ctx.lineTo(ml + ph + 0, pv + bh);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(ml + ph + 0, pv + bh);
        this.ctx.lineTo(ml + ph + bw, pv + bh);
        this.ctx.stroke();

        // right bracket
        this.ctx.beginPath();
        this.ctx.moveTo(w - ph - 0 - mr, pv + 0);
        this.ctx.lineTo(w - ph - bw - mr, pv + 0);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(w - ph + 0 - mr, pv + 0);
        this.ctx.lineTo(w - ph + 0 - mr, pv + bh);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(w - ph - mr, pv + bh);
        this.ctx.lineTo(w - ph - bw - mr, pv + bh);
        this.ctx.stroke();

        // Draw Y-axis labels
        this.ctx.fillStyle = "#7e90a6";
        this.ctx.font = "12px Arial";
        this.ctx.fillText("250", 0, pv + 12);
        this.ctx.fillText("  0", 0, h + pv - 5);


        this.ctx.restore();
      }

      drawPulse() {
        const maxH = this.canvas.height - this.paddingV * 2;
        const middleH = maxH / 2;

        this.ctx.save();
        this.ctx.strokeStyle = "#9cc1bb";
        this.ctx.lineWidth = 1;
        this.ctx.shadowBlur = 3;
        this.ctx.shadowColor = "#9cc1bb";


        this.ctx.beginPath();
        this.ctx.moveTo(this.paddingH, this.paddingV + middleH + this.buffer[0] * middleH);
        for (let x = 1; x < this.buffer.length; x++) {
          this.ctx.lineTo(this.paddingH + x, this.paddingV + middleH - this.buffer[x] * middleH);
        }

        this.ctx.stroke();
        this.ctx.restore();

        const lastPoint = this.buffer[this.buffer.length - 1];

        this.ctx.save();
        this.ctx.translate(
          this.paddingH + this.buffer.length - 1 - this.blurredCircleRadius,
          this.paddingV + middleH - lastPoint * middleH - this.blurredCircleRadius
        );
        this.ctx.fillStyle = this.gradient;
        this.ctx.fillRect(0, 0, this.blurredCircleRadius * 2, this.blurredCircleRadius * 2);
        this.ctx.restore();
      }

      drawLog() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const ph = this.paddingH;
        const pv = this.paddingV;
        const ml = -1;
        const mr = 25;

        const maxH = this.canvas.height - this.paddingV * 2;
        const middleH = maxH / 2;

        function mapRange(x, in_min, in_max, out_min, out_max) {
            return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
        }

        this.ctx.save();
        this.ctx.lineWidth = 1;

        // min line
        const yMin = mapRange(this.min, 0, 250, h-pv, pv);
        this.ctx.strokeStyle = "#0088FF88";
        this.ctx.beginPath();
        this.ctx.moveTo(ph+ml, yMin);
        this.ctx.lineTo(w-ph-mr, yMin);
        this.ctx.stroke();
        this.ctx.fillStyle = "#0088FF";
        this.ctx.font = "12px Arial";
        this.ctx.fillText(`${this.min | 0} min`, w-ph-mr, yMin + 12);

        // avg line
        const yAvg = mapRange(this.avg, 0, 250, h-pv, pv);
        this.ctx.strokeStyle = "#88888888";
        this.ctx.beginPath();
        this.ctx.moveTo(ph+ml, yAvg);
        this.ctx.lineTo(w-ph-mr, yAvg);
        this.ctx.stroke();

        this.ctx.fillStyle = "#888";
        this.ctx.font = "12px Arial";
        this.ctx.fillText(`${this.avg | 0} avg`, w-ph-mr, yAvg + 0);

        // max line
        const yMax = mapRange(this.max, 0, 250, h-pv, pv);
        this.ctx.strokeStyle = "#FF008888";
        this.ctx.beginPath();
        this.ctx.moveTo(ph+ml, yMax);
        this.ctx.lineTo(w-ph-mr, yMax);
        this.ctx.stroke();

        this.ctx.fillStyle = "#FF0088";
        this.ctx.font = "12px Arial";
        this.ctx.fillText(`${this.max | 0} max`, w-ph-mr, yMax - 12);

        // current line
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "#f22";
        this.ctx.shadowBlur = 2;
        this.ctx.shadowColor = "#ffffff";
        this.ctx.beginPath();
        this.ctx.moveTo(this.paddingH, mapRange(this.buffer2[0], 0, 250, maxH, this.paddingV));
        for (let x = 1; x < this.buffer2.length; x++) {
          this.ctx.lineTo(this.paddingH + x, mapRange(this.buffer2[x], 0, 250, maxH, 0));
        }
        this.ctx.stroke();

        this.ctx.restore();
      }

      animateIcon() {
        if (!this.heart) return;
        const lastPoint = this.buffer[this.buffer.length - 1];
        heart.style.transform = `scale(${1 - 0.15 * lastPoint})`;
      }

      render() {
        if (this.heart) {
          this.measure();
          this.log();
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrayLines();
        this.drawLog();
        this.drawPulse();
        this.animateIcon();

        window.setTimeout(this.render, 1000 / 60); // next frame
      }

      measure() {
        // waveform
        const value = this.heart.readSignal(); // sample the heart
        this.buffer.push(value);
        if (this.buffer.length > this.pulseWidth) {
          this.buffer.shift(); // scroll
        }
      }

      max = 0;
      min = 0;
      avg = 0;

      #lastLog = 0;
      log() {
        const logInterval = 50;
        const now = Date.now();
        if (now > this.#lastLog + logInterval) {
          this.#lastLog = now;
          // history line
          const bpm = this.heart.getBpm(); // get the bpm number
          this.buffer2.push(bpm);
          if (this.buffer2.length > this.pulseWidth) {
            this.buffer2.shift(); // scroll
          }

          // statistics
          if (bpm > this.max) this.max = bpm;
          if (this.min === 0 || bpm < this.min) this.min = bpm;
          this.avg = (this.avg + bpm) / 2;
        }
      }

      attachHeart(heart) {
        this.heart = heart;
      }
    }


    function updateUI(bpm, timestamp) {
      console.log(bpm);

      virtualHeart.setBpm(bpm);

      const heartRateElement = document.getElementById('heartRate');
      heartRateElement.innerText = `${bpm} BPM`;

      const lastUpdateElement = document.getElementById('lastUpdate');
      lastUpdateElement.innerText = `Min: ${ecgMonitor.min}bpm Max: ${ecgMonitor.max}bpm Average: ${parseInt(ecgMonitor.avg)}bpm`;

    }


    const pollingInterval = 500; // fetch data every few seconds

    function fetchHeatRate() {

          let bpm = parseInt(document.querySelector('.heartrate').innerText);
          let timestamp = '';

          if (simulated.checked) {
            bpm = parseInt(slider.value);
            timestamp = new Date();
          }

          updateUI(bpm, timestamp);

          setTimeout(fetchHeatRate, pollingInterval);
    }

    window.virtualHeart = null;
    window.ecgMonitor = null;

    function init(){
      virtualHeart = new VirtualHeart();
      ecgMonitor = new ECGMonitor();
      ecgMonitor.attachHeart(virtualHeart);
      fetchHeatRate();
    }
    setTimeout(init, 3000);


})();
