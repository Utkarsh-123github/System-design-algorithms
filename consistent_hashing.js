const crypto = require("crypto");

class ConsistentHashRing {
  constructor(virtualNodes = 100) {
    this.virtualNodes = virtualNodes;
    this.ring = [];
    this.servers = new Set();
  }

  hash(value) {
    const hash = crypto
      .createHash("sha256")
      .update(value)
      .digest("hex");
    return parseInt(hash.substring(0, 8), 16);
  }

  addServer(server) {
    if (this.servers.has(server)) {
      console.log(`${server} already exists`);
      return;
    }
    this.servers.add(server);
    for (let i = 0; i < this.virtualNodes; i++) {
      const virtualNode = `${server}#${i}`;
      const hash = this.hash(virtualNode);

      this.ring.push({
        hash,
        server,
        virtualNode,
      });
    }
    this.sortRing();
    console.log(`Added ${server}`);
  }

  removeServer(server) {
    if (!this.servers.has(server)) {
      console.log(`${server} does not exist`);
      return;
    }
    this.servers.delete(server);
    this.ring = this.ring.filter(
      (node) => node.server !== server
    );

    console.log(`Removed ${server}`);
  }

  sortRing() {
    this.ring.sort((a, b) => a.hash - b.hash);
  }

  getServer(key) {
    if (this.ring.length === 0) {
      return null;
    }

    const keyHash = this.hash(key);
    let left = 0;
    let right = this.ring.length - 1;
    let answer = -1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      if (this.ring[mid].hash >= keyHash) {
        answer = mid;
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    if (answer === -1) {
      answer = 0;
    }

    return this.ring[answer].server;
  }

  printDistribution(keys) {
    const distribution = {};

    for (const key of keys) {
      const server = this.getServer(key);

      distribution[server] =
        (distribution[server] || 0) + 1;
    }

    console.log("\nDistribution:");

    for (const [server, count] of Object.entries(distribution)) {
      console.log(`${server}: ${count} keys`);
    }
  }
}
