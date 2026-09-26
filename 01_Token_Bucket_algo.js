class TokenBucket{
    constructor(capacity, refillRate){
        this.capacity = capacity;
        this.tokens = capacity;
        this.refillRate = refillRate;
        this.lastRefillTime = Date.now();
    }

    refill(){
        const currenTime = Date.now();
        const elapsedTime = (currenTime - this.lastRefillTime)/1000;
        const tokensAdded = elapsedTime*this.refillRate;
        this.tokens = Math.min(this.tokens + tokensAdded, this.capacity);
        this.lastRefillTime = Date.now();
    }

    consume(token = 1){
        this.refill();
        if(this.tokens >= token){
            this.tokens -= token;
            return true;
        }
        return false;
    }
}

const bucket = new TokenBucket(5,1);
setInterval(()=>{
    console.log(bucket.consume());
},200)

