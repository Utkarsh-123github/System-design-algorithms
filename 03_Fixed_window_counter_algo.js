class FixedWindowCounter {
  constructor(windowSize, maxRequestLimit) {
    this.windowSize = windowSize * 1000;
    this.maxRequestLimit = maxRequestLimit;
    this.requests = 0;
    this.windowStart = Date.now();
  }

  allowRequest() {
    const currentTime = Date.now();

    if (currentTime - this.windowStart >= this.windowSize) {
      this.windowStart = currentTime;
      this.requests = 0;
    }

    if (this.requests < this.maxRequestLimit) {
      this.requests++;
      return true;
    }

    return false;
  }
}

const limiter = new FixedWindowCounter(10, 5);

setInterval(()=>{
    console.log(limiter.allowRequest())
},1000)