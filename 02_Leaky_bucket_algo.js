// Main concept 
// Token Bucket:
// Tokens accumulate
// Request removes a token
// Empty bucket -> reject request

// Leaky Bucket:
// Requests accumulate
// Requests leak out at fixed rate
// Full bucket -> reject request


class LeakyBucket{
    constructor(capacity, leakRate){
        this.capacity = capacity;
        this.leakRate = leakRate;
        this.bucket = 0;
        this.lastLeakTime = Date.now();
    }

    leak(){
        const currentTime = Date.now();
        const elapsedTime = (currentTime - this.lastLeakTime)/1000;
        const leakedAmount = elapsedTime*this.leakRate;
        this.bucket = Math.max(0,this.bucket - leakedAmount);
        this.lastLeakTime = Date.now();
    }

    addRequest(request = 1){
        this.leak();
        if(this.bucket + request <= this.capacity){
            this.bucket += request;
            return true;
        }
        return false;
    }
}

const bucket = new LeakyBucket(5,1);
setInterval(()=>{
    console.log(bucket.addRequest());
},200)
